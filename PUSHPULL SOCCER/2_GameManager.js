// Game Setup

const avatar = REDBRICK.AvatarManager.createDefaultAvatar();
avatar.setFollowingCamera(GLOBAL.CAMERA);
avatar.setDefaultController();
GLOBAL.CAMERA.useTPV();

GLOBAL.BALL = WORLD.getObject("Ball");

// Game Flow

GLOBAL.is_end = false;
GLOBAL.is_playing = false;

GLOBAL.startGame = () => {
    GLOBAL.is_end = false;

    GLOBAL.CAMERA.useTPV("MOUSE_LOCK");
    
    setMyStart();
    setPositionAndStartGame();
}
GLOBAL.reset = () => {
    GLOBAL.BALL.revive();
    setPositionAndStartGame(false);
};
GLOBAL.pauseGame = () => {
    GLOBAL.is_playing = false;

    PLAYER.changePlayerSpeed(0);
    PLAYER.changePlayerJumpHeight(0);

    GLOBAL.round_timer.pause();
}

function endGame() {
    GLOBAL.BALL.setDynamic(false);
    GLOBAL.pauseGame();

    GLOBAL.CAMERA.useTPV();

    GLOBAL.ui_manager.setTimeRoundTimeUI();
    GLOBAL.audio_manager.pauseOthersBGM();
    
    let is_victory = false;
    switch(GLOBAL.myStart.team){
        case "blue":
            is_victory = blue_team_score >= red_team_score;
            break;
        case "red":
            is_victory = red_team_score >= blue_team_score;
            break;
    }
    GLOBAL.ui_manager.showResultUI(is_victory);
    GLOBAL.audio_manager.playResultSfx(is_victory);

    setTimeout(() => {
        GLOBAL.is_end = true;
    }, 1000);
}
function setPositionAndStartGame(is_start = true) {
    GLOBAL.setBallPoistion();
    PLAYER.position.copy(GLOBAL.myStart.position);
    PLAYER.body.needUpdate = true;

    GLOBAL.audio_manager.playWhistleSfx();
    setTimeout(() => {
        PLAYER.changePlayerSpeed(GLOBAL.player_speed);
        PLAYER.changePlayerJumpHeight(GLOBAL.player_jump_height);
        GLOBAL.is_playing = true;
        if(is_start) {
            GLOBAL.round_timer.reset();
            GLOBAL.round_timer.start();
        }
        else {
            GLOBAL.round_timer.resume();
        }
    }, 2000);
}
function OnPointerDown(event) {
    if(!GLOBAL.is_end) return;
    if (event.button === 0) {
        GLOBAL.is_end = false;
        blue_team_score = 0;
        red_team_score = 0;

        GLOBAL.ui_manager.hideInGameUI();
        GLOBAL.ui_manager.hideResultUI();
        setTimeout(() => {
            GLOBAL.ui_manager.showLobbyUI();
            GLOBAL.audio_manager.playLobbyBGM();
        }, 500);
    }
}


// Player Start / Reset Position

let RED_TEAM_START = [];
let BLUE_TEAM_START = [];

GLOBAL.myStart = {
    team : "none",
    position : new THREE.Vector3(),
};

for(let i = 1; i <= 3; i++) {
    RED_TEAM_START.push(WORLD.getObject(`red_team_start_${i}`).position);
    BLUE_TEAM_START.push(WORLD.getObject(`blue_team_start_${i}`).position);
}

// set team information and start position
function setMyStart() {
    switch(MathUtils.getRandom(0, 1)) {
        case 0:
            GLOBAL.myStart.team = "red";
            GLOBAL.myStart.position.copy(RED_TEAM_START[MathUtils.getRandom(0, 2)]);
            break;
        case 1:
            GLOBAL.myStart.team = "blue";
            GLOBAL.myStart.position.copy(BLUE_TEAM_START[MathUtils.getRandom(0, 2)]);
            break;
    }
}


// Round Time ; Timer

// const MAX_ROUND_TIME = 360; // sec
const MAX_ROUND_TIME = 60; // sec
const round_time_text = GUI.getObject("round_time");

GLOBAL.round_timer = new REDBRICK.Timer();

function Update(dt) {
    if(!GLOBAL.is_playing) return;
    updateRoundTime();
}

function calculateTimeToString(sec) {
    const cal_min = Math.floor(sec / 60);
    const cal_sec = Math.floor(sec % 60);
    return `${cal_min}:${cal_sec}`;
}
function updateRoundTime() {
    round_time_text.setText(`${calculateTimeToString(MAX_ROUND_TIME-GLOBAL.round_timer.getTime())}`);
    if(GLOBAL.round_timer.getTime() >= MAX_ROUND_TIME) endGame();
}


// Team Score

const blue_team_score_text = GUI.getObject("blue_team_score");
const red_team_score_text = GUI.getObject("red_team_score");

let blue_team_score = 0;
let red_team_score = 0;

GLOBAL.get_score = (team_color) => {
    switch(team_color){
        case "blue":
            red_team_score++;
            red_team_score_text.setText(red_team_score);
            break;
        case "red":
            blue_team_score++;
            blue_team_score_text.setText(blue_team_score);
            break;
    }
};