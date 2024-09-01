this.onClick(() => {
    GLOBAL.ui_manager.showInGameUI();
    GLOBAL.audio_manager.playInGameBGM();
    GLOBAL.startGame();
    GLOBAL.ui_manager.hideLobbyUI();
});