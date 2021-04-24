import Constants from "../constants/Constants";
import * as THREE from "three";
import {Vector3} from "three";
import Entity from "../entities/Entity";

export default class MathUtils {
    static moveTowardDirection(direction:number, distance:number, expressionX:number):number {
        return direction * distance * this.sinExpression(expressionX) * Constants.ROLLBACK_MULTIPLIER;
    }

    static moveEntityTowardDirection(sphere: Entity , direction:Vector3, distance:number, expressionX:number) {
        sphere.position.x -= MathUtils.moveTowardDirection(direction.x, distance, expressionX);
        sphere.position.y -= MathUtils.moveTowardDirection(direction.y, distance, expressionX);
        sphere.position.z -= MathUtils.moveTowardDirection(direction.z, distance, expressionX);
    }

    static calculateVectorDirection(source:Vector3, target:Vector3, distance:number):Vector3 {
        return new Vector3(
            MathUtils.calculateDirection(source.x, target.x, distance),
            MathUtils.calculateDirection(source.y, target.y, distance),
            MathUtils.calculateDirection(source.z, target.z, distance)
        );
    }

    static calculateDirection(target:number, source:number, distance:number):number {
        return (target - source) / distance;
    }

    static sinExpression(x:number):number {
        return (Math.sin(x * Math.PI - Math.PI / 2) + 1) / 2;
    }

    static calculateDistance(target:THREE.Vector3, source:THREE.Vector3) {
        return Math.sqrt(
            Math.pow(target.x - source.x, 2)
            + Math.pow(target.y - source.y, 2)
            + Math.pow(target.z - source.z, 2)
        );
    }

    static getRandomColor():number {
        return Math.floor(Math.random()*16777215);
    }

    static getRandomNumber(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    static isIntersect(boundaries:number[], neighborBoundaries:number[]) {

        return boundaries[0] > neighborBoundaries[0] && boundaries[0] < neighborBoundaries[1] ||
            boundaries[1] > neighborBoundaries[0] && boundaries[1] < neighborBoundaries[1];
    }

    static normalizePivot(expected:number, current:number):number {
        return (expected - current) / Constants.PIVOT_INHIBITOR;
    }
}
