GLOBAL.PLAYER_MAX_SPEED = 8;
GLOBAL.PLAYER_MAX_JUMP_HEIGHT = 16;

GLOBAL.player_speed = 4;
GLOBAL.player_jump_height = 10;

PLAYER.speed = GLOBAL.player_speed;
PLAYER.jump_height = GLOBAL.player_jump_height;

PLAYER.changePlayerSpeed(0);
PLAYER.changePlayerJumpHeight(0);

function Update(dt) {
    restorePlayerPosition();
}

function OnKeyDown(event) {
    if(!GLOBAL.is_playing) return;
    if(event.code === "Space") GLOBAL.audio_manager.playJumpSfx();
}
function restorePlayerPosition() {
    if(PLAYER.position.y < -5) {
        PLAYER.position.copy(GLOBAL.myStart.position);
        PLAYER.body.needUpdate = true;
    }
}


// Cannon Ball

const CANNON_FORCE = 2000;
const RETURN_TO_POOL_TIME = 1000;
const CANNON_TYPES = [ GLOBAL.CANNON_TYPE.PUSH, GLOBAL.CANNON_TYPE.NONE, GLOBAL.CANNON_TYPE.PULL ];
let cannon_firing_position = new THREE.Vector3();
let cannon_force_vector = new THREE.Vector3();
const CANNON_FIRE_FORCE = 3000;

GLOBAL.cannon_pool.init(true, 50, "cannon_ball");

function onCollideToBall(object) {
    object.onCollide(GLOBAL.BALL, () => {
        GLOBAL.audio_manager.playHitSfx();
        GLOBAL.BALL.setDynamic(false);
        
        let force_vector = new THREE.Vector3();
        switch(object.type){
            case GLOBAL.CANNON_TYPE.PUSH:
                force_vector.subVectors(GLOBAL.BALL.position, object.position);
                break;
            case GLOBAL.CANNON_TYPE.PULL:
                force_vector.subVectors(PLAYER.position, GLOBAL.BALL.position);
                force_vector.y = 5; // Ball Height
                break;
        }
        force_vector.normalize();
        force_vector.multiplyScalar(CANNON_FORCE);
        
        setTimeout(() => {
            GLOBAL.BALL.setDynamic(true);
            GLOBAL.BALL.applyForce(force_vector.x, force_vector.y, force_vector.z);
        }, 50);
        
        GLOBAL.cannon_pool.push(object);
    }, "start");
}
function setFiringVariable() {
    cannon_firing_position.copy(GLOBAL.camera_forward);
    cannon_force_vector.copy(GLOBAL.camera_forward);
    cannon_firing_position.multiplyScalar(2);
    cannon_firing_position.add(PLAYER.position);
    cannon_firing_position.y += 3;
    
    cannon_force_vector.y = 0.1;
    cannon_force_vector.multiplyScalar(CANNON_FIRE_FORCE);
}
function OnPointerDown(event) {
    if(!GLOBAL.is_playing) return;
    
    let cannon_ball = null;
    
    setFiringVariable();
    cannon_ball = GLOBAL.cannon_pool.pop(cannon_firing_position, CANNON_TYPES[event.button]);
    onCollideToBall(cannon_ball);
    setTimeout(() => {
        cannon_ball.setDynamic(true);
        cannon_ball.applyForce(cannon_force_vector.x, cannon_force_vector.y, cannon_force_vector.z);
        GLOBAL.audio_manager.playShootSfx();
    }, 100);
    
    setTimeout(() => {
        GLOBAL.cannon_pool.push(cannon_ball);
    }, RETURN_TO_POOL_TIME);
}