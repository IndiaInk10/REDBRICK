class Grid {
    offset;
    
    constructor(offset = new THREE.Vector3()) {
        this.offset = offset;
    }

    calculateGrid(point, normal) {
        let position = point.clone();
        let min, max, ratio;

        if(normal.x !== 0) {
            ratio = position.z / this.offset.z;
            min = MathUtils.floor(ratio) * this.offset.z;
            max = MathUtils.ceil(ratio) * this.offset.z;
            position.z = position.z / max > 0.5 ? max : min;
        }
        else if(normal.z !== 0) {
            ratio = position.x / this.offset.x;
            min = MathUtils.floor(ratio) * this.offset.x;
            max = MathUtils.ceil(ratio) * this.offset.x;
            position.x = position.x / max > 0.5 ? max : min;
        }
        ratio = (position.y - 4) / this.offset.y;
        min = MathUtils.floor(ratio) * this.offset.y;
        max = MathUtils.ceil(ratio) * this.offset.y;
        position.y = position.y / max > 0.5 ? max : min;

        return position;
    }
}

const offset = new THREE.Vector3(4.55, 4, 4.55);
GLOBAL.GRID = new Grid(offset);