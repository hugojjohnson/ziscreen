import React from "react";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";

export default function Dashboard(): React.ReactElement {
    const [user] = useUser()

    /** ========== Functions ========== **/
    const dailyCard = (index: number) => {
        if (index >= user.daily_tokens.length) { return { text: "", tailwind: "" } }
        const t = user.tokens.filter(idk => idk._id == user.daily_tokens[index])[0]
        if (t == undefined) { throw new Error ("Some token shenanigans are going on") }
        return { text: t.characters, tailwind: bucketToColours(t.bucket) }
    }
    const bucketToColours = (bucket: number) => {
        if (bucket === 0) {
            return "bg-gray-300 text-black"
        } else if (bucket < 5) {
            return "bg-blue-500 text-white"
        } else {
            return "bg-yellow-500 text-white"
        }
    }

    /** ========== JSX ========== **/
    return <div>
        <div className="md:flex md:flex-row justify-between content-end">
            <div className="flex flex-col items-center md:items-start">
                <p className="text-2xl">Your characters for the day</p>
                <div className="flex flex-row gap-5">
                    { [0, 1, 2].map(i => <a href={"https://www.strokeorder.com/chinese/" + (dailyCard(i).text[0] || "")} target="blank" key={i} className={`w-14 h-14 rounded-md ${dailyCard(i).tailwind} text-2xl flex items-center justify-center mt-5`}>{dailyCard(i).text}</a>) }
                </div>
            </div>
            <button className="rounded-md bg-gray-300 hover:bg-gray-500 text-white text-xl w-32 h-16 hidden md:block">Skip</button>
        </div>

        <div className="flex flex-col items-center md:items-start md:flex-row gap-5 mt-5">
            <div className="flex flex-col justify-center items-center md:block md:w-2/3">
                <div className="w-full flex flex-row items-center justify-center md:gap-5">
                    <Link to="/add" className="w-full h-32 hidden md:block"><button className="w-full h-32 rounded-md bg-cyan-500 text-white text-2xl">Add sentences</button></Link>
                    <Link to="/practice" className="w-64 md:w-full h-16 md:h-32"><button className="w-64 md:w-full h-16 md:h-32 rounded-md bg-pink-500 text-white text-2xl">Practice</button></Link>
                </div>
                <p className="text-2xl mt-8 mb-3">Past Sentences</p>
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 mx-5 md:mx-0">
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
            <div className="w-full md:w-1/3 md:rounded-md bg-gray-100 min-h-screen p-5">
                <p className="text-2xl text-center md:text-left">Your characters</p>
                <div className="grid grid-cols-3 gap-8 place-items-center p-4 text-white mt-2 md:mt-10 text-3xl">
                    {
                        user.tokens.filter(idk => idk.punctuation === undefined).map(token => token.characters.split("").map(char => <div id={char} className={`w-20 h-20 rounded-md ${bucketToColours(token.bucket)} flex justify-center items-center`}><p>{char}</p></div>))
                    }
                </div>
            </div>
        </div>
    </div>
}