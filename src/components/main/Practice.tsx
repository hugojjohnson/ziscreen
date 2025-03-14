import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Sentence, Token } from "../../Interfaces";
import HoverImage from "../other/HoverImage";
import { post } from "../../Network";

const SECOND = 1_000
const MINUTE = 60*SECOND
const HOUR = 60*MINUTE
const DAY = 24*HOUR

// 0: Now(you have to get it right one time!)
// 1 - 3: Every day
// 4: After 2 days
// 5: After 4 days
// 6: After 7 days
// 7 +: Increase by 4 days each time maybe


const bucket_time = (key: number): number => {
    const bucket_times: Record<number, number> = { 0: 0, 1: 7*MINUTE, 2: DAY, 3: DAY, 4: 2 * DAY, 5: 4 * DAY, 6: 7 * DAY }
    return bucket_times[key] ?? (key-6)*4*DAY + 7*DAY;
}


export default function Practice(): React.ReactElement {
    const [user, setUser] = useUser()
    const [sentence, setSentence] = useState<Sentence | undefined>(undefined)
    const [token, setToken] = useState<Token | undefined>(undefined)
    const [showAnswer, setShowAnswer] = useState<boolean>(false)
    const navigate = useNavigate()

    console.log(token ? user.tokens.indexOf(token) : "")
    /** ========== Functions ========== **/
    function findToken(id: string) {
        const myToken = user.tokens.find(idk => idk._id === id)
        if (myToken === undefined) {
            console.log("Error looking for")
            console.log(id)
            console.log(user.tokens)
            throw new Error("Token not found.")
        }
        return myToken
    }

    async function reviewToken(rating: -1 | 0 | 1) {
        setShowAnswer(!showAnswer)
        if (!token) throw new Error("No token")
        const newBucket = (token.bucket+rating) < 0 ? token.bucket : token.bucket+rating
        const response = await post<Token>("main/review-token", { token: user.token}, { tokenId: token._id, newBucket: newBucket, lastReviewed: new Date().toISOString() })
        if (response.success) {
            console.log(response.data)
            // TODO: update the user.
            const user2 = structuredClone(user)
            user2.tokens[user.tokens.indexOf(token)] = response.data
            setUser(user2)
        } else {
            throw new Error("Review token request could not be made.")
        }
    }


    /** ========== useEffects ========== **/
    useEffect(() => {
        for (const sentence of user.sentences) {
            for (const tokenId of sentence.tokens) {
                const token = findToken(tokenId)
                if (new Date().getTime() - new Date(token.last_reviewed).getTime() > bucket_time(token.bucket)) {
                    console.log(new Date())
                    console.log(new Date(token.last_reviewed))
                    console.log(token.last_reviewed)
                    console.log(`This token is in bucket ${token.bucket}. Should be reviewed after ${new Date(new Date().getTime() - new Date(token.last_reviewed).getTime())} or \n ${new Date().getTime() - new Date(token.last_reviewed).getTime()}.`)
                    console.log(`They are ${(new Date().getTime() - new Date(token.last_reviewed).getTime())/DAY} days apart, which is apparently more than ${bucket_time(token.bucket)}.`)
                    setToken(token)
                    setSentence(sentence)
                    return
                }
            }
        }
    }, [user])


    /** ========== JSX ========== **/
    if (!sentence || !token) { return <p>You're out of tokens. </p> }

    return <div>
        <div className="flex flex-row justify-between">
            <div className="w-full">
                <p className="text-2xl">Practice</p>
            </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
            <p key={sentence._id} className="text-3xl">{sentence.tokens.map((token_map, token_index) => {
                const myToken = findToken(token_map)
                return <span key={token_index} className={`${myToken._id === token._id ? " font-bold " : ""}`}>{myToken.pinyin}{myToken.punctuation ? "" : " "}</span>
            })}</p>
            <p>{sentence.english}</p>

            <button className="rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white text-xl w-32 h-10 mt-10" onClick={() => setShowAnswer(!showAnswer)}>Show Answer</button>
        </div>


        {
            showAnswer && <div className="w-full flex flex-col items-center mt-10">
                {/* <img src="https://www.strokeorder.com/assets/bishun/animation/26159.gif" alt="stroke order" /> */}
                <p className="text-2xl">{token.pinyin}</p>
                {/* <HoverImage characters={token.characters} src="https://www.strokeorder.com/assets/bishun/animation/26159.gif" alt="stroke order" /> */}
                <div className="group relative">
                    <p className="text-8xl text-blue-500 mt-2">{token.characters}</p>
                    <img src="https://www.strokeorder.com/assets/bishun/animation/26159.gif" alt="stroke order" className="absolute -top-5 left-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 object-contain" />
                </div>

                <div className="flex flex-col gap-3 items-center mt-10">
                    <p key={sentence._id} className="text-3xl">{sentence.tokens.map((token, token_index) => {
                        const myToken = user.tokens.find(idk => idk._id === token)
                        if (myToken === undefined) { throw new Error("Token not found.") }
                        return <span key={token_index} className={`${myToken.punctuation ? "text-red-700" : "text-blue-500"}`}>{myToken.characters}</span>
                    })}</p>
                    <p>{sentence.english}</p>
                </div>

                <div className="w-[60%] flex flex-row justify-around">
                    <button className="rounded-md bg-gray-100 hover:bg-green-500 hover:text-white text-xl w-32 h-10 mt-10" onClick={() => reviewToken(1)}>Easy</button>
                    <button className="rounded-md bg-gray-100 hover:bg-amber-500 hover:text-white text-xl w-32 h-10 mt-10" onClick={() => reviewToken(0)}>Medium</button>
                    <button className="rounded-md bg-gray-100 hover:bg-red-500 hover:text-white text-xl w-32 h-10 mt-10" onClick={() => reviewToken(-1)}>Hard</button>
                </div>
            </div>
        }


    </div>
}