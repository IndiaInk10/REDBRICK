const reset_position = new THREE.Vector3(0, 5, 0);

const bound = {
    x : [ -96, 96 ],
    y : [ -55, 102.5 ],
    z : [ -146, 146 ]
};

function Update(dt) {
    if(checkBallInside()) return;
    GLOBAL.setBallPoistion();
}

function checkBallInside() {
    for (const key in GLOBAL.BALL.position) {
        if(key === "isVector3") continue;
        if(GLOBAL.BALL.position[key] <= bound[key][0] || GLOBAL.BALL.position[key] >= bound[key][1]) return false;
    }
    return true;
}
GLOBAL.setBallPoistion = (position = reset_position) => {
    GLOBAL.BALL.setDynamic(false);

    GLOBAL.BALL.position.copy(position);
    if(GLOBAL.BALL.hasBody) GLOBAL.BALL.body.needUpdate = true;
    
    setTimeout(() => {
        GLOBAL.BALL.setDynamic(true);
    }, 50);
}