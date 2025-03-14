import React, { useState } from "react";
import { post } from "../../Network";
import { Link, useNavigate } from "react-router-dom";

function inputArea(label: string, img: string, placeholder: string, password: boolean = false, value: string, setValue: React.Dispatch<React.SetStateAction<string>>): React.ReactElement {
    return <>
        <p className="text-gray-600 text-sm self-start pt-5">{label}</p>
        <div className="group w-full relative flex flex-row gap-2 items-center justify-center px-1 py-2">
            <div className="flex flex-row gap-2 items-center w-full">
                <img className={`w-5 h-5 opacity-35 ${password && "-rotate-45"}`} src={img} />
                <input className="outline-none w-full" type={password ? "password" : ""} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div className="h-[2px] w-full bg-gray-200 absolute bottom-0"></div>
            <div className="transition-all duration-300 bg-blue-500 h-[2px] w-0 group-focus-within:w-full absolute bottom-0"></div>
        </div>
    </>
}

export default function Signup(): React.ReactElement {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [errorText, setErrorText] = useState("")

    /** ========== Functions ========== **/
    async function requestSignUp(): Promise<void> {
        // encrypt the password before sending it
        // from https://stackoverflow.com/questions/18338890
        async function saltify(data: string): Promise<string> {
            // encode as UTF-8
            const msgBuffer = new TextEncoder().encode(data);

            // hash the data
            const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

            // convert ArrayBuffer to Array
            const hashArray = Array.from(new Uint8Array(hashBuffer));

            // convert bytes to hex string
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        }

        if (username === "" || password === "") {
            setErrorText("Please fill in the username and password.")
            return
        }
        if (password !== confirmPassword) {
            setErrorText("Passwords do not match.")
            return
        }
        if (!email.includes("@")) {
            setErrorText("Email is not valid.")
            return
        }
        const salt = await saltify(email + password)
        const response = await post("users/sign-up/email", {}, {
            username: username,
            email: email,
            hash: salt,
            date_joined: new Date(),
            projects: []
        })
        if (response.success) {
            navigate("/sign-in")
            return
        } else {
            setErrorText(response.data)
        }
    }

    /** ========== JSX ========== **/
    return <div
        className="w-full h-screen flex items-center justify-center">
        <div className="bg-white w-96 h-[60%] rounded-lg shadow-lg flex flex-col px-12">
            <h1 className="text-3xl font-bold mt-10 self-center">Sign up</h1>

            {inputArea("Username", "/media/user.png", "Type your username", false, username, setUsername)}
            {inputArea("Email", "/media/email.png", "Type your email", false, email, setEmail)}
            {inputArea("Password", "/media/key.svg", "•••••••••", true, password, setPassword)}
            {inputArea("Confirm password", "/media/key.svg", "•••••••••", true, confirmPassword, setConfirmPassword)}


            <button className="rounded-full w-full self-center text-2xl hover:text-white bg-gray-100 hover:bg-blue-500 flex justify-center items-center p-1 mt-10 py-2" onClick={async () => (await requestSignUp())}>Sign up</button>

            <Link to="/sign-in" className="self-center mt-6"><p className="text-blue-950">Sign in</p></Link>

            <p>{errorText}</p>

        </div>
    </div>
}
