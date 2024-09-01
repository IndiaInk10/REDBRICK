GLOBAL.is_start = false;

let currentStage = 0;

const STAGES = [
    WORLD.getObject('Stage_1_floor'),
    WORLD.getObject('Stage_2_floor'),
];

const RESPAWN_POSITIONS = [
    WORLD.getObject('Respawn_1'),
    WORLD.getObject('Respawn_2'),
];

const BOUNDS = [
    -5,
    -20,
];

for (let i = 0; i < 2; i++) {
    STAGES[i].onCollide(PLAYER, () => {
        currentStage = i;
    }, 'start');
}

WORLD.getObject('Clear_floor').onCollide(PLAYER, () => {
    GLOBAL.audio_manager.playClearBGM();
    PLAYER.changePlayerSpeed(0);
    GLOBAL.is_start = false;
}, 'start');

function Update(dt) {
    if (PLAYER.position.y > BOUNDS[currentStage]) return;
    PLAYER.position.copy(RESPAWN_POSITIONS[currentStage].position);
    PLAYER.body.needUpdate = true;
}