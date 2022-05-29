import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {FormContainer} from "./FormContainer";
import Main from "../../../main/Main";
import {Root} from "react-dom/client";
import {TableData} from "./TableData";

export const CreateTablePage = ({root}: {root:Root}) => {
    const [chosenDimensions, setChosenDimension] = useState(1);
    const [rowData, setRowData] = useState([{width: 0, height: 0, depth: 0, weight: 0}]);

    const addRow = () => {
        const newRow = {width: 0, height: 0, depth: 0, weight: 0};
        setRowData([...rowData, newRow]);
    }

    const onDimensionChange = (index:number) => {
        setChosenDimension(index + 1);
    }

    const onFormSubmit = () => {
        const formattedData = rowData.map(element => {
            Object.keys(element).map(key => {
                element[key] = Number(element[key]);
            });
            return element;
        });
        root.unmount();
        new Main(chosenDimensions, formattedData);
    }

    return (
            <FormContainer>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="text-center" as={"h3"}>Pick number of dimensions:</Form.Label>
                    <div className="text-center">
                        {['1 dimension', '2 dimensions'].map((label: string, index: number) => (
                            <Form.Check
                                checked={Number(label[0]) === chosenDimensions}
                                style={{fontSize: '1.25rem'}}
                                inline
                                key={`dimension-${index + 1}`}
                                type={"radio"}
                                name="dimensions"
                                id={`dimension-${index}`}
                                label={`${label}`}
                                onClick={onDimensionChange.bind(this, index)}
                            />
                        ))}
                    </div>
                </Form.Group>
                <div className="d-flex flex-column">
                    <Button className="mb-2 align-self-end" variant="success" onClick={addRow.bind(this)}>
                        Add
                    </Button>
                    <TableData chosenDimensions={chosenDimensions} rowData={rowData} setRowData={setRowData} />
                </div>
                <Button className="align-center" variant="primary" type="submit" onClick={onFormSubmit.bind(this)}>
                    Submit
                </Button>
            </FormContainer>
    );
}

