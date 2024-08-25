// AudioManager

class AudioManager {
    constructor(bgm_name_array, sfx_name_array) {
        this.bgm = [];
        this.sfx = [];
        for(let i = 0; i < bgm_name_array.length; i++) {
            this.bgm.push(WORLD.getObject(bgm_name_array[i]).getAudio());
        }
        for(let i = 0; i < sfx_name_array.length; i++) {
            this.sfx.push(WORLD.getObject(sfx_name_array[i]).getAudio());
        }
    }
    
    // can't use stop replace with pause
    pauseOthersBGM() {
        for(let i = 0; i < this.bgm.length; i++) {
            this.bgm[i].pause();
        }
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
        this.sfx[5].play();
    }
    playDefeatSfx() {
        this.sfx[6].play();
    }
}

GLOBAL.audio_manager = new AudioManager(["lobby_bgm", "ingame_bgm"],["jump_sfx", "shoot_sfx", "hit_sfx", "whistle_sfx", "goal_sfx", "victory_sfx", "defeat_sfx"]);
GLOBAL.audio_manager.initSfx();

// UIManager

const start_transparency = 100;
const fade_out_tween = new TWEEN.Tween(start_transparency);
fade_out_tween.to(0, 1000);

class UIManager {
    constructor(ui_group_array) {
        this.ui = [];
        for(let i = 0; i < ui_group_array.length; i++) {
            for(let j = 0; j < ui_group_array[i].length; j++) {
                this.ui.push([]);
                this.ui[i].push(GUI.getObject(ui_group_array[i][j]));
                this.ui[i][j].hide();
            }
        }
    }
    
    
    showLobbyUI() {
        this.ui[0][0].show();
        this.ui[0][1].show();
    }
    hideLobbyUI() {
        for(let i = 0; i < this.ui[0].length; i++) {
            this.ui[0][i].hide();
        }
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
        this.ui[1][3].setText("6:00");
        for(let i = 0; i < this.ui[1].length; i++) {
            this.ui[1][i].show();
        }
    }
    hideInGameUI() {
        for(let i = 0; i < this.ui[1].length; i++) {
            this.ui[1][i].setText("");
            this.ui[1][i].hide();
        }
    }
    showResultUI(is_victory = true) {
        is_victory ? this.ui[2][0].show() : this.ui[2][1].show();
    }
    hideResultUI() {
        for(let i = 0; i < this.ui[2].length; i++) {
            this.ui[2][i].hide();
        }
    }
}

GLOBAL.ui_manager = new UIManager([["lobby", "guide_button", "blocker", "guide_manual"], ["red_team_score", "blue_team_score", "vs", "round_time"], ["victory", "defeat"]]);
GLOBAL.ui_manager.showLobbyUI();