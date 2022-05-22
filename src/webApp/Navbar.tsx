import React from "react";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";

export const NavBar = () => {
    return (
    <Navbar>
        <Container>
            <Navbar.Brand href="#home" className='fw-bolder'>Cargo Placing Task Solver</Navbar.Brand>
        </Container>
    </Navbar>);
}

