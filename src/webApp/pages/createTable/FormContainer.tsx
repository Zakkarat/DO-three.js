import React from "react";
import { Form } from "react-bootstrap";
import {Container} from "react-bootstrap";

export const FormContainer = ({children}) => {
    return (
        <Container className="border rounded mt-5 mb-5">
            <Form className="d-flex flex-column align-items-center mt-3">
                {children}
            </Form>
        </Container>);
}

