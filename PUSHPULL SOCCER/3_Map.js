// Skybox

// const sky = WORLD.getObject("sky");
// const geometry = new THREE.SphereGeometry( 500, 60, 40 );
// // invert the geometry on the x-axis so that all of the faces point inward
// geometry.scale( -1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( sky.material );
// const mesh = new THREE.Mesh( geometry, material );
// mesh.position.copy(new THREE.Vector3(0, 100, 0));

// WORLD.add(mesh);


// Jump Zone

for(let i = 1; i <= 6; i++) {
    let jump_zone = WORLD.getObject(`jump_zone_${i}`);
    jump_zone.onCollide(PLAYER, () => {
        // 온라인의 경우, 자기 자신인지 구분 필요
        if(PLAYER.jump_height === GLOBAL.PLAYER_MAX_JUMP_HEIGHT) return;
        PLAYER.jump_height = GLOBAL.PLAYER_MAX_JUMP_HEIGHT;
        PLAYER.changePlayerJumpHeight(PLAYER.jump_height);
    }, "collision");
    jump_zone.onCollide(PLAYER, () => {
        // 온라인의 경우, 자기 자신인지 구분 필요
        if(PLAYER.jump_height === GLOBAL.player_jump_height) return;
        PLAYER.jump_height = GLOBAL.player_jump_height;
        PLAYER.changePlayerJumpHeight(PLAYER.jump_height);
    }, "end");
}

// Goal Post

const BLUE_PARTICLE = WORLD.getObject("blue_particle");
const RED_PARTICLE = WORLD.getObject("red_particle");

const blue_team_goal_post = WORLD.getObject("blue_team_goal_post");
const red_team_goal_post = WORLD.getObject("red_team_goal_post");

blue_team_goal_post.onCollide(GLOBAL.BALL, () => {
    GLOBAL.pauseGame();
    GLOBAL.audio_manager.playGoalSfx();
    BLUE_PARTICLE.position.x = GLOBAL.BALL.position.x;
    BLUE_PARTICLE.position.y = GLOBAL.BALL.position.y;
    GLOBAL.BALL.kill();
    setTimeout(() => {
        BLUE_PARTICLE.position.y = -1000;
        GLOBAL.reset();
    }, 1500);
    GLOBAL.get_score("blue");
}, "start");
red_team_goal_post.onCollide(GLOBAL.BALL, () => {
    GLOBAL.pauseGame();
    GLOBAL.audio_manager.playGoalSfx();
    RED_PARTICLE.position.x = GLOBAL.BALL.position.x;
    RED_PARTICLE.position.y = GLOBAL.BALL.position.y;
    GLOBAL.BALL.kill();
    setTimeout(() => {
        RED_PARTICLE.position.y = -1000;
        GLOBAL.reset();
    }, 1500);
    GLOBAL.get_score("red");
}, "start");