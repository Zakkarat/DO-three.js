import {singleton} from "tsyringe";

@singleton()
export class Settings {
    public squareNumber: number = 20;
}