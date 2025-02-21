import React from "react";
import useUser from "../../hooks/useUser";

export default function Dashboard(): React.ReactElement {
    const [user] = useUser()

    /** ========== useEffects ========== **/
    // interface requestType {
    //     quote: string
    // }
    // useEffect(() => {
    //     const response = get<requestType>("main/get-quote", { token: user.token})
    //     console.log(response)
    // }, [user.token])

    /** ========== JSX ========== **/
    return <div className="max-w-screen-lg mx-auto pt-40 flex flex-col">
        <h1 className="text-4xl mb-40">Welcome, {user.username}!</h1>
    </div>
}