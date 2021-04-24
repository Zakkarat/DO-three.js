import * as THREE from "three";

export class HemiLight extends THREE.HemisphereLight {
    constructor(scene:THREE.Scene) {
        super(0xffffff, 0xffffff, 1);
        this.color.setHSL( 0.6, 1, 0.6 );
        this.groundColor.setHSL( 0.095, 1, 0.75 );
        this.position.set( 0, 500, 0 );
        scene.add( this );
    }
}