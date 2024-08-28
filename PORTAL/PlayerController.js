isEquiped = true;

// Debug

const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( geometry, material ); 
WORLD.add(sphere);

function OnKeyDown(event) {
    if (event.code === 'Escape') isEquiped = !isEquiped;
}

function OnPointerDown(event) {
    if (!isEquiped) return;
    if (event.button !== GLOBAL.PORTAL_TYPE.ORANGE && event.button !== GLOBAL.PORTAL_TYPE.BLUE) return;
    GLOBAL.portal_gun.shootPortal(event.button);
}