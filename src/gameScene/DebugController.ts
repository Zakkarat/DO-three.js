import * as dat from 'dat.gui';
import {GUI} from "dat.gui";


export default class DebugController {
    private gui: GUI;

    constructor() {
        this.gui = new dat.GUI();
        this.gui.addFolder('Camera');
        this.gui.addFolder('Lines');
    }

}