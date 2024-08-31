// UICamera

GLOBAL.CAMERA = WORLD.getObject('UICamera');

this.onClick(() => {
    this.kill();
    GLOBAL.CAMERA = WORLD.getObject('MainCamera');
    GLOBAL.CAMERA.activate();
    GLOBAL.audio_manager.playInGameBGM();
});