import React from "react";
import {NavBar} from "./Navbar";
import {Outlet} from "react-router-dom";

export const Layout = () => {
    return (
        <>
            <NavBar />
            <main>
                <Outlet />
            </main>
        </>
    );
}