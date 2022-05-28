import React, {SyntheticEvent, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {createRoot} from "react-dom/client";
import {NavBar} from "./Navbar";
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {FormContainer} from "./FormContainer";
import {Table} from "react-bootstrap";
import Main from "../main/Main";

const App = () => {
    const [chosenDimensions, setChosenDimension] = useState(1);
    const [rowData, setRowData] = useState([{width: 0, height: 0, depth: 0, weight: 0}]);
    const addRow = () => {
        const newRow = {width: 0, height: 0, depth: 0, weight: 0};
        setRowData([...rowData, newRow]);
    }

    const removeRow = (index:number) => {
        const rows = [...rowData];
        rows.splice(index, 1);
        setRowData(rows);
    }

    const editRow = (index: number, type: string, event:SyntheticEvent ) => {
        const rows = [...rowData];
        rows[index][type] = (event.target as HTMLInputElement).value;
        setRowData(rows);
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

    const isInputDisabled = (typeIndex: number):boolean => {
        const dimensions = Number(chosenDimensions);
        switch (dimensions){
            case 1:
                return dimensions <= typeIndex && typeIndex !== 3;
            case 2:
                return typeIndex !== 3;
        }
    }

    return (
        <>
            <NavBar/>
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
                <Form.Group>
                    <Table bordered>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Width of Box</th>
                            <th>Height of Box</th>
                            <th>Depth of Box</th>
                            <th>Weight of Box</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {new Array(rowData.length).fill(1).map((_, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    {['width', 'height', 'depth', 'weight'].map((type:string, typeIndex) => (
                                        <td><Form.Control
                                            id={`${type}-${index}`}
                                            value={rowData[index][type]}
                                            type="number"
                                            disabled={(isInputDisabled(typeIndex))}
                                            onChange={editRow.bind(this, index, type)}
                                        /></td>
                                    ))}
                                    <td>
                                        <Button className="align-center" variant="danger" onClick={removeRow.bind(this, index)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Form.Group>
                </div>
                <Button className="align-center" variant="primary" type="submit" onClick={onFormSubmit.bind(this)}>
                    Submit
                </Button>
            </FormContainer>
        </>
    );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App/>);