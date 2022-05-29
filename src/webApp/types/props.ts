import {Dispatch, SetStateAction} from "react";

export interface ITableDataProps {
    chosenDimensions: number;
    rowData: ISceneObjectProperties[];
    setRowData: Dispatch<SetStateAction<ISceneObjectProperties[]>>

}

interface ISceneObjectProperties {
    width: number;
    height: number;
    depth: number;
    weight:number;
}

export interface IAuthenticationPageProps {
    authType: 'Login' | 'Register'
}

export interface IFormAuthMeeting {
    login: string;
    password: string;
    repeatPassword?: string;
}