class InteractBox {
    isSelected;
    isShowGuide; // isSelectable

    #one; // object(this)
    selectGuide; // object

    static offset;

    resetOpacity = {
        origin : null,
        target : null,
    }

    get position() {
        return this.#one.position;
    }
    get body() {
        return this.#one.body;
    }
    setDynamic(isDynamic = true) {
        this.#one.setDynamic(isDynamic);
    }

    constructor(object) {
        this.isSelected = false;
        this.isShowGuide = false;

        this.#one = object;
        this.selectGuide = object.children[0];

        this.offset = new THREE.Vector3(0, -1.25, 0);

        this.resetOpacity.origin = object.children[0].material.opacity;
        this.resetOpacity.target = 0;

        object.children[0].material.opacity = 0;
    }

    getDistanceBetweenPlayer() {
        let offsetPosition = new THREE.Vector3();
        offsetPosition.addVectors(this.offset, this.position);
        return offsetPosition.distanceTo(PLAYER.position);
    }

    showSelectGuide() {
        if (this.isShowGuide) return;
        this.isShowGuide = true;
        this.selectGuide.material.opacity = this.resetOpacity.origin;
    }
    hideSelectGuide() {
        if (!this.isShowGuide) return;
        this.isShowGuide = false;
        this.selectGuide.material.opacity = this.resetOpacity.target;
    }

    selectBox() {
        this.isSelected = true;
        this.setDynamic(false);
        this.hideSelectGuide();
    }
    deselectBox() {
        this.isSelected = false;
        this.setDynamic(true);
    }

    Update(dt) {
        if (this.isSelected) {
            this.position.copy(PLAYER.selectPosition);
            this.body.needUpdate = true;
            return;
        }
        if (this.getDistanceBetweenPlayer() > 9) {
            this.hideSelectGuide();
            return;
        }
        this.showSelectGuide();
    }
}

const interactBox = new InteractBox(this);

function OnKeyDown(event) {
    if (event.code === 'KeyF') {
        interactBox.isShowGuide ? interactBox.selectBox() : interactBox.deselectBox();
    }
}

function Update(dt) {
    interactBox.Update(dt);
}