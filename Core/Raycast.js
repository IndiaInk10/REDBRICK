const ball = WORLD.getObject("Ball");

let raycaster = new THREE.Raycaster();
const raycastObjects = [ball];
let points = [];

raycaster.layers.enableAll();
raycaster.firstHitOnly =  true;

const text = GUI.getObject("direction");

// Debug
const material = new THREE.LineBasicMaterial({color:0xff0000});
let geometry = new THREE.BufferGeometry().setFromPoints(points);
let line = new THREE.Line(geometry, material);
const s_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const s_geometry = new THREE.SphereGeometry( 0.5, 32, 16 );
const sphere = new THREE.Mesh( s_geometry, s_material );
WORLD.add(sphere);

function Start() {
    points.push(PLAYER.position);
    points.push(GLOBAL.cameraForward.clone());
}

function Update() {
    points[1].copy(GLOBAL.cameraForward);
    points[1].multiplyScalar(10);
    points[1].add(PLAYER.position);
    points[1].add(new THREE.Vector3(0, 3, 0));
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    line = new THREE.Line(geometry, material);
    WORLD.add(line);
    text.setText(`${PLAYER.position.x}, ${PLAYER.position.z}`);
}

function OnKeyDown(event) {
    if(event.code === "KeyF") {
        points[1].normalize();
        raycaster.set(PLAYER.position, points[1]);
        console.log(raycaster.ray);
        const intersects = raycaster.intersectObjects(raycastObjects);
        
        if(intersects.length > 0) {
            console.log(intersects);
            let point = intersects[0].point;
            sphere.position.copy(point);
            point.subVectors(ball.position, point);
            point.normalize();
            point.multiplyScalar(1000);
            ball.applyForce(point.x, point.y, point.z);
        }
    }
}