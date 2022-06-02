import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Form} from "react-bootstrap";
import {FormContainer} from "./FormContainer";
import Main from "../../../main/Main";
import {Root} from "react-dom/client";
import {TableData} from "./TableData";
import axios from "axios";
import {useLocation} from "react-router-dom";

export const CreateTablePage = ({root}: {root:Root}) => {
    const location = useLocation();
    const [chosenDimensions, setChosenDimension] = useState(1);
    const [rowData, setRowData] = useState([{width: 0, height: 0, depth: 0, weight: 0}]);
    const [tableId, setTableId] = useState(0);

    useEffect(() => {
       const getTable = async (tableId) => {
           const response = await axios.get(`http://localhost:3000/api/getTable?tableId=${tableId}`, {withCredentials: true})
           setRowData(response.data);
       }
       console.log(location);
       setTableId(location.state as number);
       if (tableId) {
           getTable(location.state);
       }
    });

    const addRow = () => {
        const newRow = {width: 0, height: 0, depth: 0, weight: 0};
        setRowData([...rowData, newRow]);
    }

    const onDimensionChange = (index:number) => {
        setChosenDimension(index + 1);
    }

    const onFormSubmit = () => {
        const formattedData = getFormattedData();
        root.unmount();
        new Main(chosenDimensions, formattedData);
    }

    const saveTable = () => {
        const formattedData = getFormattedData();
        if (tableId) {
            axios.post('http://localhost:3000/api/insertTable', {tableId, rows: rowData, dimensionType: chosenDimensions}, {
                withCredentials: true,
            })
        }
        console.log(formattedData);
    };

    function getFormattedData() {
        return rowData.map(element => {
            Object.keys(element).map(key => {
                element[key] = Number(element[key]);
            });
            return element;
        });
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
                <Button className="align-center mt-1" variant="success" type="button" onClick={saveTable.bind(this)}>
                    Save Data
                </Button>
            </FormContainer>
    );
}

