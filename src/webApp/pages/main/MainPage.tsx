import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Row } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import {Link} from "react-router-dom";
import {AuthWrapper} from "../../wrappers/AuthWrapper";

export const MainPage = () => {
    return (
            <Container className='d-flex flex-column justify-content-center align-content-center mt-5'>
                <Row className={"d-flex justify-content-center mt-5"}>
                    <Image style={{width: "35%"}} src={'/assets/logo.png'} />
                </Row>
                <Row >
                    <Col className='text-center'>
                        <h1>Welcome to Cargo Placing Task Solver</h1>
                        <h3 className='gray'>This app will help you to properly place your packages in your truck</h3>
                    </Col>
                </Row>
                <Row className='mt-4 d-flex justify-content-center'>
                    <Col xs={1} className='text-center'>
                        <Link to='login'><Button size="lg">Login</Button></Link>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <Link to='register'><Button variant="success" size="lg">Register</Button></Link>
                    </Col>
                </Row>
            </Container>
    );
}

