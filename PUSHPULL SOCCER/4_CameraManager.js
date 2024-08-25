GLOBAL.CAMERA = WORLD.getObject("MainCamera");
GLOBAL.camera_forward = new THREE.Vector3();

function Update(dt) {
    GLOBAL.camera_forward.subVectors(PLAYER.position, GLOBAL.CAMERA.position);
    GLOBAL.camera_forward.y = 0;
    GLOBAL.camera_forward.normalize();
}