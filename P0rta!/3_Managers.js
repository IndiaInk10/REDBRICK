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
    playClearBGM() {
        this.pauseOthersBGM();
        this.bgm[2].play();
    }
    
    initSfx() {
        this.sfx[0].setVolume(0.5);
    }
    playPortalShootSfx(portal_type) {
        // this.sfx[0].stop();
        this.sfx[portal_type].play();
    }
    playPortalOpenSfx() {
        // this.sfx[0].stop();
        this.sfx[1].play();
    }
    playPortalEnterSfx() {
        // this.sfx[0].stop();
        this.sfx[3].play();
    }
    playPortalExitSfx() {
        // this.sfx[0].stop();
        this.sfx[4].play();
    }
    playButtonPositiveSfx() {
        // this.sfx[0].stop();
        this.sfx[5].play();
    }
    playButtonNegativeSfx() {
        // this.sfx[0].stop();
        this.sfx[6].play();
    }
}

GLOBAL.audio_manager = new AudioManager(
    [
        'lobby_bgm', 
        'ingame_bgm', 
        'clear_bgm',
    ],
    [
        'portalgun_shoot_orange_sfx', 
        'portal_open_sfx', 
        'portalgun_shoot_blue_sfx', 
        'portal_enter_sfx',
        'portal_exit_sfx', 
        'button_positive_sfx', 
        'button_negative_sfx',
    ],
);
GLOBAL.audio_manager.initSfx();