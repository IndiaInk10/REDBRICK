const INTERACTBOX = GLOBAL.InteractBoxFromObject(this);

function OnKeyDown(event) {
    if (event.code === 'KeyF') {
        INTERACTBOX.isShowGuide ? INTERACTBOX.selectBox() : INTERACTBOX.deselectBox();
    }
}

function Update(dt) {
    INTERACTBOX.Update(dt);
}