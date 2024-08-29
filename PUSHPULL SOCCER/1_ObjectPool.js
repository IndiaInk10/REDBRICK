const reset_position = new THREE.Vector3(0, -1000, 0);

class ObjectPool {
    is_physics;
    reset_position;
    count;
    objects;

    init(is_physics = false, count, object_name) {
        this.is_physics = is_physics;
        this.reset_position = reset_position;
        this.count = count;
        this.objects = [];
        for(let i = 1; i <= count; i++) {
            this.objects.push(WORLD.getObject(`${object_name}_${i}`));
            this.objects[i-1].is_inside_pool = true;
        }
    }
    
    #setPosition(object, target_position) {
        object.position.copy(target_position);
        if(object.hasBody) object.body.needUpdate = true;
    }
    pop(target_position) {
        // if(this.objects.length <= 0) return;
        
        let object = this.objects.shift();
        object.is_inside_pool = false;
        
        this.#setPosition(object, target_position);
        if(this.is_physics) setTimeout(() => object.setDynamic(true), 50);
        
        return object;
    }
    push(object) {
        // if(object === null) return;

        object.is_inside_pool = true;
        
        if(this.is_physics) object.setDynamic(false);
        this.#setPosition(object, this.reset_position);
        
        this.objects.push(object);
    }
}


GLOBAL.CANNON_TYPE = {
    NONE: "none",
    PULL: "pull",
    PUSH: "push",
};
const COLOR = {
    NONE: 0xFFFFFF,
    PULL: 0x00FF00,
    PUSH: 0xFF0000,
};

class CannonPool extends ObjectPool {

    init(is_physics = false, count, object_name) {
        super.init(is_physics, count, object_name);
        this.objects.forEach(val => {
            val.type = GLOBAL.CANNON_TYPE.NONE;
        });
    }
    
    pop(target_position, type) {
        if(this.objects.length <= 0) return;
        
        let object = super.pop(target_position);
        object.type = type;
        switch(type){
            case GLOBAL.CANNON_TYPE.PULL:
                object.material.color.set(COLOR.PULL);
                break;
            case GLOBAL.CANNON_TYPE.PUSH:
                object.material.color.set(COLOR.PUSH);
                break;
        }
        return object;
    }
    push(object) {
        if(object === null) return;
        if(object.is_inside_pool) return;
        
        super.push(object);
        object.type = GLOBAL.CANNON_TYPE.NONE;
        object.material.color.set(COLOR.NONE);
    }
}

GLOBAL.cannon_pool = new CannonPool();