import {BoxGeometry, MeshLambertMaterial, SphereBufferGeometry} from "three";
import Entity from "./Entity";

export default class Sphere extends Entity {
    static build(radius:number, widthSegments:number, heightSegments:number,
                 color:number, x:number, y:number, z:number):Sphere {
        let sphereBufferGeometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
        let meshLambertMaterial = new MeshLambertMaterial({color});
        let result = new Sphere(sphereBufferGeometry, meshLambertMaterial);
        result.receiveShadow = true;
        result.position.set(x, y, z);
        return result;
    }

    protected addWeightLabel():void {

    }

    getBoundaries():number[] {
        return [];
    }

    public getWidth() {
        return (this.geometry as BoxGeometry).parameters.width;
    }

    protected onDrag():void {
    }
}
