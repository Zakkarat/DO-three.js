import * as THREE from "three";
import {MeshLambertMaterial} from "three";
import Entity from "./Entity";

export default class Cube extends Entity {
    static build(color:number, x:number, y:number):Cube {
        const geometry = new THREE.BoxGeometry( 100, 100, 1 );
        let meshLambertMaterial = new MeshLambertMaterial({color});
        let result = new Cube(geometry, meshLambertMaterial);
        result.receiveShadow = true;
        result.position.set(x, y, -50);
        // result._angle = angle;
        return result;
    }
}
