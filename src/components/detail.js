import React, { useState, useEffect } from "react"

export const Detail = props => {
    const [id, setId] = useState(props.id)

    useEffect(() => {
        setId(props.id);
        console.log(props.id)
    }, [props.id]);

    return (
        <p>{id}</p>
    )
}