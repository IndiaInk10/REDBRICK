GLOBAL.COLOR = {
    ORANGE : 0xFF5D00,
    BLUE : 0x0065FF,
}

GLOBAL.PORTAL_TYPE = {
    ORANGE : 0,
    BLUE : 2,
}

const avatar = REDBRICK.AvatarManager.createDefaultAvatar();
GLOBAL.CAMERA = WORLD.getObject("MainCamera");
const followingCamera = avatar.setFollowingCamera(GLOBAL.CAMERA);
avatar.setDefaultController();
GLOBAL.CAMERA.useFPS();

GLOBAL.MAINCAMERA = GLOBAL.CAMERA;