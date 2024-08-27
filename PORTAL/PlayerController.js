isEquiped = true;

// Debug

const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( geometry, material ); 
WORLD.add( sphere );

// Raycast

const orange_portal = WORLD.getObject('Orange_Portal');
const blue_portal = WORLD.getObject('Blue_Portal');

const bvh = WORLD.getObjectByName('bvhCollider');

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,0);
const raycastObjects = [bvh];

raycaster.layers.enableAll();
raycaster.firstHitOnly = true;

function OnKeyDown(event) {
    if(event.code === 'KeyF') {
        raycasting();
    } 
}

function raycasting() {
    raycaster.setFromCamera(pointer, GLOBAL.CAMERA);

    const intersects = raycaster.intersectObjects(raycastObjects);

    if(intersects.length > 0) {
        // sphere.position.copy(intersects[0].point);
        let position = new THREE.Vector3();
        let normal = new THREE.Vector3();
        intersects[0].face.normal.x = MathUtils.round(intersects[0].face.normal.x);
        intersects[0].face.normal.y = MathUtils.round(intersects[0].face.normal.y);
        intersects[0].face.normal.z = MathUtils.round(intersects[0].face.normal.z);
        position.copy(intersects[0].point);
        position.add(intersects[0].face.normal);
        normal.addVectors(blue_portal.position, intersects[0].face.normal);
        blue_portal.position.copy(position);
        blue_portal.lookAt(normal);
    }
}