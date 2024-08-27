class Door {
    // isOpened;
    isOpening;
    parts = [];
    duration;
    originToTargetDistance;
    currentTweens;
    centerPosition;
    resetPositions = {
        origin: [],
        target: [],
    };

    constructor(object, duration = 2) {
        // this.isOpened = false;
        this.isOpening = false;
        this.centerPosition = object.position.clone();
        this.duration = duration;
        object.children.forEach(val => {
            switch(val.title) {
                case 'side_a':
                    this.resetPositions.target[0] = val.position.clone();
                    break;
                case 'side_a_door':
                    this.parts[0] = val;
                    this.resetPositions.origin[0] = val.position.clone();
                    break;
                case 'side_b':
                    this.resetPositions.target[1] = val.position.clone();
                    break;
                case 'side_b_door':
                    this.parts[1] = val;
                    this.resetPositions.origin[1] = val.position.clone();
                    break;
                default: 
                    break;
            }
        });
        this.originToTargetDistance = this.resetPositions.origin[0].distanceTo(this.resetPositions.target[0]);
        this.currentTweens = [ null, null ];
    }
    
    getDistanceBetweenPlayer() {
        return this.centerPosition.distanceTo(PLAYER.position);
    }
    calculateDurationByDistance(distance) {
        let ratio = distance / this.originToTargetDistance;
        return this.duration * ratio;
    }
    createTweenAndStart(key_str) {
        this.currentTweens.forEach(val => { if(val) val.stop() });

        let distance = this.parts[0].position.distanceTo(this.resetPositions[key_str][0]);
        for(let i = 0; i < 2; i++) {
            this.currentTweens[i] = new TWEEN.Tween(this.parts[i].position);
            this.currentTweens[i].to({
                x: this.resetPositions[key_str][i].x, 
                z: this.resetPositions[key_str][i].z,
            }, this.calculateDurationByDistance(distance) * 1000)
            .onComplete(() => {
                this.currentTweens[i] = null;
            });
            this.currentTweens[i].start();
        }
    }
    open() {
        if(this.isOpening) return;
        this.isOpening = true;
        this.createTweenAndStart('target');
    }
    close() {
        if(!this.isOpening) return;
        this.isOpening = false;
        this.createTweenAndStart('origin');
    }
}

const DOOR = new Door(this);

function Update(dt) {
    if(DOOR.getDistanceBetweenPlayer() > 16) {
        if(DOOR.isOpening) DOOR.close(); 
        return; 
    }
    else {
        if(!DOOR.isOpening) DOOR.open();
        return;
    }
}