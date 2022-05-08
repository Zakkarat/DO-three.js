import * as THREE from "three";

export default class Constants {
    static readonly DEFAULT_ANCHOR:number = 0.5;

    static readonly ROTATION_INCREMENT:number = 0.01;
    static readonly ROTATION_MULTIPLIER:number = 0.1;

    static readonly PIVOT_INHIBITOR:number = 16;

    static readonly MAX_TIME_PASSED:number = 1;

    static readonly ROLLBACK_MULTIPLIER:number = 0.5;

    static readonly DELAY:number = 2000;

    static readonly FOV = 35;
    static readonly WIDTH = window.innerWidth;
    static readonly HEIGHT = window.innerHeight;
    static readonly NEAR = 1;
    static readonly FAR = 10000;
    static readonly PIXEL_RATIO = window.devicePixelRatio;

    static readonly RADIUS = 264;
    static readonly ANGLE = 120;

    static readonly BACKGROUND_COLOR = new THREE.Color( 0x21252d );

    static LEFT =  window.innerWidth / 2 - 50 - 400;
    static RIGHT =  -window.innerWidth / 2 + 50 + 400
    static TOP = window.innerHeight / 2 - 50 - 100;
    static BOTTOM = -window.innerHeight / 2 + 50 + 100;
    static ZOOM_FACTOR = 0;
}
