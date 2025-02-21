import React, { useContext } from "react";
import { UserContext } from "../../Context";
import { useNavigate } from "react-router-dom";

export function NoPage(): React.ReactElement {
    const [user] = useContext(UserContext)
    const navigate = useNavigate()

    if (user === null) {
        navigate("/")
    }
    return <div className="w-full h-screen flex justify-center items-center">
        <p className="">404 Not found.</p>
    </div>
}