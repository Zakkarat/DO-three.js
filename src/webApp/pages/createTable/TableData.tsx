import React, {SyntheticEvent} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {Table} from "react-bootstrap";
import {ITableDataProps} from "../../types/props";

export const TableData = ({chosenDimensions, rowData, setRowData}: ITableDataProps) => {
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
    );
}

