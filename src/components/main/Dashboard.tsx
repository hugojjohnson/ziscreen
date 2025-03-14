import React from "react";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";

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
    return <div>
        <div className="flex flex-row justify-between content-end">
            <div>
                <p className="text-2xl">Your current sentence</p>
                <p className="text-blue-500 text-4xl mt-2">你好，我的好朋友!</p>
            </div>
            <button className="rounded-md bg-gray-300 hover:bg-gray-500 text-white text-xl w-32 h-16">Skip</button>
        </div>

        <div className="flex flex-row gap-5 mt-5">
            <div className="w-2/3">
                <div className="w-full flex flex-row gap-5">
                    <Link to="/add" className="w-full h-32"><button className="w-full h-32 rounded-md bg-cyan-500 text-white text-2xl">Add sentences</button></Link>
                    <Link to="/practice" className="w-full h-32"><button className="w-full h-32 rounded-md bg-pink-500 text-white text-2xl">Practice</button></Link>
                </div>
                <p className="text-2xl mt-8 mb-3">Past Sentences</p>
                <div className="flex flex-col gap-3">
                    {
                        user.sentences.map(sentence => <div key={sentence._id}><p key={sentence._id} className="text-3xl">{sentence.tokens.map((token, token_index) => {
                            const myToken = user.tokens.find(idk => idk._id === token)
                            if (myToken === undefined) { throw new Error("Token not found.") }
                            return <span key={token_index} className={`${myToken.punctuation ? "text-red-700" : "text-blue-500"}`}>{myToken.characters}</span>
                        })}</p>
                        <p>{sentence.english}</p>
                        </div>)
                    }
                </div>
            </div>
            <div className="w-1/3 rounded-md bg-gray-100 h-screen p-5">
                <p className="text-2xl">Your characters</p>
                <div className="grid grid-cols-3 gap-8 place-items-center p-4 text-white mt-10 text-3xl">
                    {
                        user.tokens.filter(idk => idk.punctuation === undefined).map(token => token.characters.split("").map(char => <div id={char} className="w-20 h-20 rounded-md bg-blue-500 flex justify-center items-center"><p>{char}</p></div>))
                    }
                </div>
            </div>
        </div>
    </div>
}