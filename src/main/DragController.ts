import {DragControls} from "three/examples/jsm/controls/DragControls";
import {container, singleton} from "tsyringe";
import {Object3D} from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";

@singleton()
export class DragController {
    private _dragControls: DragControls;
    private _camera: Camera;
    private _renderer: Renderer;

    constructor() {
        this._camera = container.resolve(Camera);
        this._renderer = container.resolve(Renderer);
    }

    public addDragControls(objects:Object3D[]) {
        this._dragControls = new DragControls(objects, this._camera, this._renderer.domElement);
        this._dragControls.addEventListener("dragstart", (event) => {
            event.object.onDragStart();
        });
        this._dragControls.addEventListener ( 'drag', (event) => {
            event.object.onDrag();
        })
        this._dragControls.addEventListener("dragend", (event) => {
            event.object.onDragEnd();
        });
    }

    public removeDragControls() {
        this._dragControls.dispose();
    }
}