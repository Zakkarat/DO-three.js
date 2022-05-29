import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {createRoot} from "react-dom/client";
import {NavBar} from "./Navbar";
import { AuthenticationPage } from "./pages/authentication/AuthenticationPage";
import {MainPage} from "./pages/main/MainPage";

const App = () => {

    return (
        <>
            <NavBar/>
            <AuthenticationPage authType={"Login"}/>
            {/*<MainPage />*/}
            {/*<CreateTablePage root={root}/>*/}
        </>
    );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App/>);