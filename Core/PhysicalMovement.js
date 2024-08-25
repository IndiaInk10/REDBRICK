const velocity = 40;
const jumpForce = 200;
GLOBAL.zero = new THREE.Vector3();

let direction = new THREE.Vector3();
GLOBAL.moveDirection = new THREE.Vector3();

GLOBAL.cameraForward = new THREE.Vector3();

const debugText = GUI.getObject("direction");
const camera = WORLD.getObject("MainCamera");
PLAYER.setDynamic(true);

const axis = new THREE.Vector3(0, 1, 0);
let angle = 0.0;

// debug
const geometry = new THREE.SphereGeometry(0.5, 32, 16);
const material = new THREE.MeshBasicMaterial( { color : 0xff0000 } );
const mesh = new THREE.Mesh(geometry, material);
WORLD.add(mesh);
mesh.scale.multiplyScalar(0.5);
mesh.parent = PLAYER;

const ANGLE = {
    UP : 0,
    LEFTUP : Math.PI / 4,
    LEFT : Math.PI / 2,
    LEFTDOWN : 3 * Math.PI / 4,
    DOWN : Math.PI,
    RIGHTDOWN : 5 * Math.PI / 4,
    RIGHT : 3 * Math.PI / 2,
    RIGHTUP : 7 * Math.PI / 4,
};

function Update(dt) {
    PLAYER.applyForce(0, 2, 0);
    
    GLOBAL.moveDirection.x = PLAYER.position.x - camera.position.x;
    GLOBAL.moveDirection.z = PLAYER.position.z - camera.position.z;
    GLOBAL.moveDirection.normalize();
    GLOBAL.cameraForward.copy(GLOBAL.moveDirection);
    
    if(!hasInput()) 
    {
        mesh.position.copy(GLOBAL.zero);
        return;
    }  
    
    setAngle();
    GLOBAL.moveDirection.applyAxisAngle(axis, angle);
    
    mesh.position.copy(GLOBAL.moveDirection);
    
    PLAYER.applyForce(GLOBAL.moveDirection.x * velocity, 0, GLOBAL.moveDirection.z * velocity);
    PLAYER.rotateY(angle);
}

function OnKeyDown(event){
    switch(event.code){
        case "KeyW":
            direction.z = 1;
            break;
        case "KeyS":
            direction.z = -1;
            break;
        case "KeyA":
            direction.x = 1;
            break;
        case "KeyD":
            direction.x = -1;
            break;
        case "Space":
            PLAYER.applyForce(0, jumpForce, 0);
            break;    
        case "ControlLeft":
            PLAYER.applyForce(0, jumpForce * -5, 0);
            break;
        default:
            break;
    }
}
function OnKeyUp(event){
    switch(event.code){
        case "KeyW":
        case "KeyS":
            direction.z = 0;
            break;
        case "KeyA":
        case "KeyD":
            direction.x = 0;
            break;
        default:
            break;
    }
}

function setAngle() {
    if(direction.z == 1 && direction.x == 0)  angle = ANGLE.UP;
    else if(direction.z == 1 && direction.x == 1) angle = ANGLE.LEFTUP;
    else if(direction.z == 0 && direction.x == 1) angle = ANGLE.LEFT;
    else if(direction.z == -1 && direction.x == 1) angle = ANGLE.LEFTDOWN;
    else if(direction.z == -1 && direction.x == 0) angle = ANGLE.DOWN;
    else if(direction.z == -1 && direction.x == -1) angle = ANGLE.RIGHTDOWN;
    else if(direction.z == 0 && direction.x == -1) angle = ANGLE.RIGHT;
    else if(direction.z == 1 && direction.x == -1) angle = ANGLE.RIGHTUP;
}

function hasInput() {
    return (direction.x != 0 || direction.z != 0) ? 1 : 0;
}