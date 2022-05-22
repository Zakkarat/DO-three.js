import React, {SyntheticEvent, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {createRoot} from "react-dom/client";
import {NavBar} from "./Navbar";
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {FormContainer} from "./FormContainer";
import {Table} from "react-bootstrap";

const App = () => {
    const [rowData, setRowData] = useState([{x: 0, y: 0, z: 0, weight: 0}]);

    const addRow = () => {
        const newRow = {x: 0, y: 0, z: 0, weight: 0};
        setRowData([...rowData, newRow]);
    }
    const removeRow = (index:number) => {
        const rows = [...rowData];
        rows.splice(index, 1);
        setRowData(rows);
    }

    const editRow = (index: number, type: string, event:SyntheticEvent ) => {
        const rows = [...rowData];
        console.log(event);
        rows[index][type] = (event.target as HTMLInputElement).value;
        setRowData(rows);
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
                                style={{fontSize: '1.25rem'}}
                                inline
                                key={`dimension-${index + 1}`}
                                type={"radio"}
                                name="dimensions"
                                id={`default-${index}`}
                                label={`${label}`}
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
                                    {['x', 'y', 'z', 'weight'].map((type:string) => (
                                        <td><Form.Control id={`${type}-${index}`} value={rowData[index][type]} onChange={editRow.bind(this, index, type)}/></td>
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
                <Button className="align-center" variant="primary" type="submit">
                    Submit
                </Button>
            </FormContainer>
        </>
    );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App/>);