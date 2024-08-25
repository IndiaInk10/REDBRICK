const bound = {
    x : [ -96, 96 ],
    y : [ -55, 102.5 ],
    z : [ -146, 146 ]
};

function checkBallInside() {
    for (const key in GLOBAL.BALL.position) {
        if(key == "isVector3") continue;
        if(GLOBAL.BALL.position[key] <= bound[key][0] || GLOBAL.BALL.position[key] >= bound[key][1])
        {
            console.log("out of bound");
            return false;
        }
    }
    return true;
}
function Update(dt) {
    if(checkBallInside()) return;
    GLOBAL.setBallPoistion();
}