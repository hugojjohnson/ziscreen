import React, { useContext, useState } from "react";
import { UserContext } from "../../Context";

import { Sentence, Token, User } from "../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../Network";

function inputArea(label: string, img: string, placeholder: string, password: boolean=false, value: string, updateValue: React.Dispatch<React.SetStateAction<string>>): React.ReactElement {
    return <>
        <p className="text-gray-600 text-sm self-start pt-5">{label}</p>
        <div className="group w-full relative flex flex-row gap-2 items-center justify-center px-1 py-2">
            <div className="flex flex-row gap-2 items-center w-full">
                <img className={`w-5 h-5 opacity-35 ${password && "-rotate-45"}`} src={img} />
                <input className="outline-none w-full" value={value} onChange={e => updateValue(e.target.value)} type={password ? "password" : ""} placeholder={placeholder} />
            </div>
            <div className="h-[2px] w-full bg-gray-200 absolute bottom-0"></div>
            <div className="transition-all duration-300 bg-blue-500 h-[2px] w-0 group-focus-within:w-full absolute bottom-0"></div>
        </div>
    </>
}


export default function Signin(): React.ReactElement {
    const [, setUser] = useContext<User>(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorText, setErrorText] = useState<string>("")

    /** ========== Functions ========== **/
    interface responseType {
        user: { username: string, email: string, date_joined: string },
        token: { value: string },
        sentences: Sentence[],
        tokens: Token[],
        daily_tokens: string[],
        daily_date: string
    }
    async function requestLogin(): Promise<void> {
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

        if (email === "" || password === "") {
            setErrorText("Please fill in the email and password.")
            return
        }
        if (!email.includes("@")) {
            setErrorText("Email is invalid.")
            return
        }

        const salt = await saltify(email + password)
        const response = await get<responseType>("users/sign-in/email", {
            email: email,
            hash: salt
        })
        if (response.success) {
            setUser({
                username: response.data.user.username,
                email: response.data.user.email,
                date_joined: response.data.user.date_joined,
                token: response.data.token.value,
                sentences: response.data.sentences,
                tokens: response.data.tokens,
                daily_tokens: response.data.daily_tokens,
                daily_date: response.data.daily_date
            });
            navigate('/');
        }
        if (response.status === 401) {
            setErrorText("Username or password incorrect. Please try again.")
        } else {
            setErrorText("An unknown error occurred.")
        }
    }

    /** ========== JSX ========== **/
    return <div
        className="w-full h-screen flex items-center justify-center">
        <div className="bg-white w-96 h-[60%] rounded-lg shadow-lg flex flex-col px-12">
            <h1 className="text-3xl font-bold mt-10 self-center">Sign in</h1>

            { inputArea("Email", "/media/user.png", "Type your email", false, email, setEmail)}
            { inputArea("Password", "/media/key.svg", "•••••••••", true, password, setPassword)}

            <p className="text-gray-500 text-sm text-right mb-5 mt-1 hover:cursor-pointer">Forgot password?</p>

            <button className="rounded-full w-full self-center text-2xl hover:text-white bg-gray-100 hover:bg-blue-500 flex justify-center items-center p-1 mt-10 py-2" onClick={async () => (await requestLogin())}>Sign in</button>

            <p>{errorText}</p>

            <Link to="/sign-up" className="self-center mt-6"><p className="text-blue-950">Sign up</p></Link>

        </div>

    </div>
}
