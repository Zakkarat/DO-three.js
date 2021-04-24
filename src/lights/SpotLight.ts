import * as THREE from "three";

export default class SpotLight extends THREE.SpotLight {
    constructor(scene:THREE.Scene, camera:THREE.Camera, intensity:number, x:number) {
        super(0xf0fdff, intensity);
        this.position.set(x, 400, 0);
        this.castShadow = true;
        this.shadow.bias = 0.0001;
        this.angle = Math.PI / 4;
        this.penumbra = 0.05;
        this.decay = 2;
        this.distance = 1000;
        this.shadow.camera.near = 1;
        this.shadow.camera.far = 1000;
        this.shadow.mapSize.width = 1024;
        this.shadow.mapSize.height = 1024;
        camera.lookAt(scene.position);
        scene.add( this );
    }
}