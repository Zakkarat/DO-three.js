import React, {useEffect} from "react";
import {Container, Table} from "react-bootstrap";
import {AuthWrapper} from "../../wrappers/AuthWrapper";
import {useFetch} from "../../hooks/useFetch";
import {tableInfo} from "../../types/types";
import { Button } from "react-bootstrap";
import {Link} from "react-router-dom";

export const PersonalPage = () => {
    const [tableData] = useFetch<tableInfo[]>('api/getTables')

    useEffect(() => {
    }, [tableData])
    return (
        <AuthWrapper>
            <Container className={'mt-4'}>
                <Link to='/tableEdit'><Button className="me-3" variant="success">Create New Table</Button></Link>
                <Table bordered className='mt-3'>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Number of Columns</th>
                        <th>Dimensions</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData?.length && tableData.map((row:tableInfo, id:number) =>
                    (<tr>
                        <td>{id + 1}</td>
                        <td>{row.name}</td>
                        <td>{row.numberInColumn}</td>
                        <td>{`${row.dimensionType} Dimensional`}</td>
                        <td><Link to='/tableEdit' state={row.tableId}><Button className="me-3" variant="warning">Modify</Button></Link>
                            <Button variant="danger">Remove</Button></td>
                    </tr>))}
                    </tbody>
                </Table>
            </Container>
        </AuthWrapper>
    )
}