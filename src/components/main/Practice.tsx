import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { Sentence, Token } from "../../Interfaces";
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
    const bucket_times: Record<number, number> = { 0: 0, 1: 10*MINUTE, 2: DAY, 3: DAY, 4: 2 * DAY, 5: 4 * DAY, 6: 7 * DAY }
    return bucket_times[key] ?? (key-6)*4*DAY + 7*DAY;
}


export default function Practice(): React.ReactElement {
    const [user, setUser] = useUser()
    const [sentence, setSentence] = useState<Sentence | undefined>(undefined)
    const [token, setToken] = useState<Token | undefined>(undefined)
    const [showAnswer, setShowAnswer] = useState<boolean>(false)
    const [showDialogue, setShowDialogue] = useState<boolean>(false) // 0; still on reviews. 1; showing. 2; shown.

    /** ========== Functions ========== **/
    function findToken(id: string) {
        const myToken = user.tokens.find(idk => idk._id === id)
        if (myToken === undefined) {
            throw new Error("Token not found.")
        }
        return myToken
    }

    async function reviewToken(rating: -1 | 0 | 1) {
        setShowAnswer(!showAnswer)
        if (!token) throw new Error("No token")
        let newBucket = token.bucket+rating
        if (token.bucket === 0 && rating === -1) { // Separate lower bounds depending on whether the word is 'known' or not.
            newBucket = 0
        }
        if (token.bucket === 1 && rating === -1) {
            newBucket = 1
        }
        const response = await post<Token>("main/review-token", { token: user.token}, { tokenId: token._id, newBucket: newBucket, lastReviewed: new Date().toISOString() })
        if (response.success) {
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
                const localToken = findToken(tokenId)
                if (localToken.punctuation) { continue }
                if (localToken.bucket === 0) { continue }
                if (new Date().getTime() - new Date(localToken.last_reviewed).getTime() > bucket_time(localToken.bucket)) {
                    console.log(new Date())
                    console.log(new Date(localToken.last_reviewed))
                    console.log(localToken.last_reviewed)
                    console.log(`This token is in bucket ${localToken.bucket}. Should be reviewed after ${new Date(new Date().getTime() - new Date(localToken.last_reviewed).getTime())} or \n ${new Date().getTime() - new Date(localToken.last_reviewed).getTime()}.`)
                    setToken(localToken)
                    setSentence(sentence)
                    return
                }
            }
        }
        for (const sentence of user.sentences) {
            console.log(sentence.english)
            for (const tokenId of sentence.tokens) {
                const localToken = findToken(tokenId)
                if (localToken.punctuation) { continue }
                if (user.daily_tokens.includes(localToken._id)) {
                    console.log("Partial match")
                    console.log(localToken.bucket)
                }
                if (user.daily_tokens.includes(localToken._id) && localToken.bucket === 0) {
                    
                    if (localStorage.getItem("shownDialogue") !== new Date().toLocaleDateString()) { setShowDialogue(true) }
                    setToken(localToken)
                    setSentence(sentence)
                    return
                }
            }
        }
        setToken(undefined)
        setSentence(undefined)
    }, [user])
    
    /** ========== JSX ========== **/
    if (!sentence || !token) { return <div className="flex flex-col items-center mt-20"><p>You're all done for now! Come back later to practice more Hanzi.</p></div> }
    if (showDialogue) {
        return <div className="flex flex-col items-center mt-32">
            <p>You're all caught up with your reviews. Ready to learn some new characters?</p>
            <button onClick={() => { setShowDialogue(false); localStorage.setItem("shownDialogue", new Date().toLocaleDateString()) }} className="p-3 px-10 mt-10 rounded-md border-[1px] hover:border-none hover:bg-blue-500 hover:text-white">Begin</button>
        </div>
    }

    return <div className="text-center md:text-left">

        <div className="mt-28 flex flex-col gap-3 items-center mx-10 md:mx-0">
            <p key={sentence._id} className="text-2xl md:text-3xl">{sentence.tokens.map((token_map, token_index) => {
                const myToken = findToken(token_map)
                return <span key={token_index} className={`${myToken._id === token._id ? " font-bold " : ""}`}>{myToken.pinyin}{myToken.punctuation ? "" : " "}</span>
            })}</p>
            <p>{sentence.english}</p>

            <button className="rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white text-xl w-32 h-10 mt-10" onClick={() => setShowAnswer(!showAnswer)}>Show Answer</button>
        </div>


        {
            showAnswer && <div className="flex flex-col items-center mt-10 mx-10 md:mx-0">
                <p className="text-2xl">{token.pinyin}</p>
                <div className="flex flex-row">
                {
                    token.characters.split("").map(char => <div key={char} className="group relative">
                        <p className="text-8xl text-blue-500 mt-2">{char}</p>
                        <img src={`https://www.strokeorder.com/assets/bishun/animation/${char.codePointAt(0)}.gif`} alt="stroke order" className="absolute -top-5 left-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 object-contain" />
                    </div>)
                }
                </div>
                {/* <a href={"https://www.strokeorder.com/chinese/" + token.characters[0]} target="blank" className="text-8xl text-blue-500 mt-2">{token.characters}</a> */}

                <div className="flex flex-col gap-3 items-center mt-10">
                    <p key={sentence._id} className="text-2xl md:text-3xl">{sentence.tokens.map((token, token_index) => {
                        const myToken = user.tokens.find(idk => idk._id === token)
                        if (myToken === undefined) { throw new Error("Token not found.") }
                        return <span key={token_index} className={`${myToken.punctuation ? "text-red-700" : "text-blue-500"}`}>{myToken.characters}</span>
                    })}</p>
                    <p>{sentence.english}</p>
                </div>

                <div className="w-full md:w-[60%] flex flex-row justify-between md:justify-around">
                    <button className="rounded-md bg-gray-100 hover:bg-green-500 hover:text-white text-xl w-20 md:w-32 h-10 mt-10" onClick={() => reviewToken(1)}>Easy</button>
                    <button className="rounded-md bg-gray-100 hover:bg-amber-500 hover:text-white text-xl w-20 md:w-32 h-10 mt-10" onClick={() => reviewToken(0)}>Medium</button>
                    <button className="rounded-md bg-gray-100 hover:bg-red-500 hover:text-white text-xl w-20 md:w-32 h-10 mt-10" onClick={() => reviewToken(-1)}>Hard</button>
                </div>
            </div>
        }


    </div>
}