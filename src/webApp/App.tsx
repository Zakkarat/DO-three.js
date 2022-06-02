import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {createRoot} from "react-dom/client";
import { AuthenticationPage } from "./pages/authentication/AuthenticationPage";
import {MainPage} from "./pages/main/MainPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "./Layout";
import { PersonalPage } from "./pages/personal/PersonalPage";
import {CreateTablePage} from "./pages/createTable/CreateTablePage";

const App = () => {

    return (
        <BrowserRouter window={window}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="register" element={<AuthenticationPage authType='Register' />} />
                    <Route path="login" element={<AuthenticationPage authType='Login' />} />
                    <Route path="personal" element={<PersonalPage />} />
                    <Route path="tableEdit" element={<CreateTablePage root={root} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App/>);