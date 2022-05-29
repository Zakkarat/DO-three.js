import React, {SyntheticEvent, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {IAuthenticationPageProps, IFormAuthMeeting} from "../../types/props";
import axios from "axios";

export const AuthenticationPage = ({authType}: IAuthenticationPageProps) => {

    const onSubmit = (e:SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData: IFormAuthMeeting = [...target.children].reduce((formData, inputParentElement) => {
            const formInputElement = (inputParentElement.children[1] as HTMLFormElement);
            console.log(formInputElement);
            if (formInputElement?.value) {
                formData[formInputElement.id] = formInputElement.value;
            }
            return formData;
        }, {} as IFormAuthMeeting);
        if (authType === 'Login' || formData.password === formData.repeatPassword) {
            axios.post(`http://localhost:3000/auth/${authType.toLowerCase()}`, {
                ...formData
            }, {
                withCredentials: true
            });
        }
    }

    return (
        <Container className='d-flex flex-column align-items-center mt-5'>
            <h1>{authType}</h1>
            <Form className='w-25' onSubmit={onSubmit.bind(this)}>
                <Form.Group className="mb-3" controlId="login">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="login" placeholder="Enter login"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"/>
                </Form.Group>
                {authType === "Register" &&
                <Form.Group className="mb-3" controlId="repeatPassword">
                    <Form.Label>Retype Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"/>
                </Form.Group>}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>);
}

