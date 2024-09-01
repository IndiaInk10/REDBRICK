PLAYER.selectPosition = new THREE.Vector3();
const distance = 8;
const offset = new THREE.Vector3(0, 5, 0);

function OnKeyDown(event) {
    if (event.code === 'Escape') isEquiped = !isEquiped;
}

function OnPointerDown(event) {
    if (!GLOBAL.is_start) return;
    if (event.button !== GLOBAL.PORTAL_TYPE.ORANGE && event.button !== GLOBAL.PORTAL_TYPE.BLUE) return;
    GLOBAL.portal_gun.shootPortal(event.button);
}

function updateSelectPosition() {
    GLOBAL.CAMERA.getWorldDirection(PLAYER.selectPosition);
    PLAYER.selectPosition.multiplyScalar(distance);
    PLAYER.selectPosition.add(offset);
    PLAYER.selectPosition.add(PLAYER.position);
}

function Update(dt) {
    updateSelectPosition();
}