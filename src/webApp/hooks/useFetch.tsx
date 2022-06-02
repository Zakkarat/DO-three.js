import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = <T,>(path:string): T[] => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/${path}`, {withCredentials: true})
            .then((response) => setData(response.data));
    }, [path]);

    return [data];
};
