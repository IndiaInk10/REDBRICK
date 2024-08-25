const reset_position = new THREE.Vector3(0, -1000, 0);

class ObjectPool {
    constructor() {}
    // constructor(is_physics = false, pool_count, object_name){
    //     this.is_physics = is_physics;
    //     this.reset_position = reset_position;
    //     this.pool_count = pool_count;
    //     this.objects = [];
    //     for(let i = 1; i <= pool_count; i++) {
    //         this.objects.push(WORLD.getObject(`${object_name}_${i}`));
    //         this.objects[i-1].type = "none"; // cannon_type
    //     }
    // }
    
    init(is_physics = false, pool_count, object_name) {
        this.is_physics = is_physics;
        this.reset_position = reset_position;
        this.pool_count = pool_count;
        this.objects = [];
        for(let i = 1; i <= pool_count; i++) {
            this.objects.push(WORLD.getObject(`${object_name}_${i}`));
            this.objects[i-1].is_inside_pool = true;
        }
    }
    
    setPosition(object, target_position) {
        object.position.copy(target_position);
        object.body.needUpdate = true;
    }
    pop(target_position) {
        // if(this.objects.length <= 0) return;
        
        let object = this.objects[0];
        this.objects.shift();
        object.is_inside_pool = false;
        
        // this.setPosition(object, target_position);
        object.position.copy(target_position);
        if(object.hasBody) object.body.needUpdate = true;
        if(this.is_physics) setTimeout(() => object.setDynamic(true), 50);
        
        return object;
    }
    push(object) {
        // if(object == null) return;
        
        if(this.is_physics) object.setDynamic(false);
        object.position.copy(this.reset_position);
        if(object.hasBody) object.body.needUpdate = true;
        
        this.objects.push(object);
    }
}

GLOBAL.TYPE = {
    NONE: "none",
    PULL: "pull",
    PUSH: "push",
};
const COLOR = {
    NONE: 0xFFFFFF,
    PULL: 0x00FF00,
    PUSH: 0xFF0000,
};

const scale_vector = new THREE.Vector3(2, 2, 2);
class CannonPool extends ObjectPool {
    constructor () { super(); }
    
    init(is_physics = false, pool_count, object_name) {
        super.init(is_physics, pool_count, object_name);
        for(let i = 1; i <= pool_count; i++) {
            this.objects[i-1].type = GLOBAL.TYPE.NONE; // cannon_type
            this.objects[i-1].scale.copy(scale_vector);
        }
    }
    
    pop(target_position, type) {
        if(this.objects.length <= 0) return;
        
        let object = super.pop(target_position);
        object.type = type;
        switch(type){
            case GLOBAL.TYPE.PULL:
                object.material.color.set(COLOR.PULL);
                break;
            case GLOBAL.TYPE.PUSH:
                object.material.color.set(COLOR.PUSH);
                break;
        }
        return object;
    }
    push(object) {
        if(object == null) return;
        if(object.is_inside_pool) return;
        
        super.push(object);
        object.type = GLOBAL.TYPE.NONE;
        object.material.color.set(COLOR.NONE);
    }
}

GLOBAL.cannon_pool = new CannonPool();