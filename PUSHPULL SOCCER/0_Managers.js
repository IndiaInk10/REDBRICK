// UIManager

class UIManager {
    ui;

    constructor(ui_group_array) {
        this.ui = [];
        ui_group_array.forEach(arr => {
            this.ui.push(arr.map(val => {
                let obj = GUI.getObject(val);
                obj.hide();
                return obj;
            }));
        });
    }
    
    
    showLobbyUI() {
        this.ui[0][0].show();
        this.ui[0][1].show();
    }
    hideLobbyUI() {
        this.ui[0].forEach(val => {
            val.hide();
        });
    }
    showGuideManualUI() {
        this.ui[0][2].show();
        this.ui[0][3].show();
    }
    hideGuideManualUI() {
        this.ui[0][2].hide();
        this.ui[0][3].hide();
    }
    setTimeRoundTimeUI() {
        this.ui[1][3].setText("0:00");
    }
    showInGameUI() {
        this.ui[1][0].setText(0);
        this.ui[1][1].setText(0);
        this.ui[1][2].setText("VS");
        // this.ui[1][3].setText("6:0");
        this.ui[1][3].setText("1:0");
        this.ui[1].forEach(val => {
            val.show();
        });
    }
    hideInGameUI() {
        this.ui[1].forEach(val => {
            val.setText('');
            val.hide();
        });
    }
    showResultUI(is_victory = true) {
        is_victory ? this.ui[2][0].show() : this.ui[2][1].show();
    }
    hideResultUI() {
        this.ui[2].forEach(val => {
            val.hide();
        });
    }
}

GLOBAL.ui_manager = new UIManager(
    [
        [
            "lobby", 
            "guide_button", 
            "blocker", 
            "guide_manual"
        ], 
        [
            "red_team_score", 
            "blue_team_score", 
            "vs", 
            "round_time"
        ], 
        [
            "victory", 
            "defeat"
        ]
    ]
);
GLOBAL.ui_manager.showLobbyUI();


// AudioManager

class AudioManager {
    bgm;
    sfx;

    constructor(bgm_name_array, sfx_name_array) {
        this.bgm = bgm_name_array.map(val => WORLD.getObject(val).getAudio());
        this.sfx = sfx_name_array.map(val => WORLD.getObject(val).getAudio());
    }
    
    // can't use stop replace with pause
    pauseOthersBGM() {
        this.bgm.forEach(val => {
            val.pause();
        });
    }
    playLobbyBGM() {
        this.pauseOthersBGM();
        this.bgm[0].play();
    }
    playInGameBGM() {
        this.pauseOthersBGM();
        this.bgm[1].play();
    }
    
    initSfx() {
        this.sfx[0].setVolume(0.75);
        this.sfx[4].detune = 1000;
        this.sfx[4].setVolume(0.5);
    }
    playJumpSfx() {
        // this.sfx[0].stop();
        this.sfx[0].play();
    }
    playShootSfx() {
        // this.sfx[0].stop();
        this.sfx[1].play();
    }
    playHitSfx() {
        // this.sfx[0].stop();
        this.sfx[2].play();
    }
    playWhistleSfx() {
        // this.sfx[0].stop();
        this.sfx[3].play();
    }
    playGoalSfx() {
        // this.sfx[0].stop();
        this.sfx[4].play();
    }
    playResultSfx(is_victory = true) {
        is_victory ? this.playVictorySfx() : this.playDefeatSfx();
    }
    playVictorySfx() {
        // this.sfx[0].stop();
        this.sfx[5].play();
    }
    playDefeatSfx() {
        // this.sfx[0].stop();
        this.sfx[6].play();
    }
}

GLOBAL.audio_manager = new AudioManager(
    [
        "lobby_bgm", 
        "ingame_bgm"
    ],
    [
        "jump_sfx", 
        "shoot_sfx", 
        "hit_sfx", 
        "whistle_sfx", 
        "goal_sfx", 
        "victory_sfx", 
        "defeat_sfx"
    ],
);
GLOBAL.audio_manager.initSfx();


// CameraManager

GLOBAL.CAMERA = WORLD.getObject("MainCamera");
GLOBAL.camera_forward = new THREE.Vector3();

function Update(dt) {
    GLOBAL.camera_forward.subVectors(PLAYER.position, GLOBAL.CAMERA.position);
    GLOBAL.camera_forward.y = 0;
    GLOBAL.camera_forward.normalize();
}