import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import pinyin from "pinyin";
import { post } from "../../Network";
import { useNavigate } from "react-router-dom";


type char = {
    value: string; // the chinese character itself
    pinyin: string[];
    index: number;
}
type token = {
    chars: char[],
    punctuation?: boolean,
    tempKey: number
}

export default function Add(): React.ReactElement {
    const [user] = useUser()
    const [sentence, setSentence] = useState<string>("")
    const [tokens, setTokens] = useState<token[]>([])
    const [draggedItem, setDraggedItem] = useState<token | null>(null);
    const navigate = useNavigate()


    useEffect(() => {
        // setTokens([{ chars: [{ value: "好", pinyin: ["hǎo", "hào"], index: 0 }], punctuation: false, tempKey: 0 }])
        setTokens([])
    }, [])

    /** ========== Functions ========== **/
    function isChineseCharacter(char: string) {
        const chineseCharacterRegex = /[\u4e00-\u9fff]+/;
        return chineseCharacterRegex.test(char);
    }

    function characterify() {
        setTokens(sentence.split('').filter(char => char !== " ").map((char, tempKey) => ({ chars: [{ value: char, pinyin: pinyin(char, { heteronym: true })[0], index: 0 }], punctuation: isChineseCharacter(char) ? undefined : true, tempKey: tempKey })))
    }

    const handleDragStart = (e: React.DragEvent<HTMLParagraphElement>, item: token) => {
        console.log(e)
        console.log(item)
        setDraggedItem(item);
        e.dataTransfer.setData("text/plain", item.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLParagraphElement>) => {
        e.preventDefault(); // Necessary to allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLParagraphElement>, targetItem: token) => {
        e.preventDefault();
        // console.log('Dragged Item:', draggedItem);
        // console.log('Target Item:', targetItem);
        console.log("Dragged item key: " + targetItem.tempKey)
        console.log("Target key: " + draggedItem?.tempKey)
        let temp = structuredClone(tokens)
        const draggedIndex = temp.findIndex(idk => idk.tempKey === draggedItem?.tempKey)
        const targetIndex = temp.findIndex(idk => idk.tempKey === targetItem.tempKey)
        if (draggedIndex - targetIndex !== 1) { console.log(draggedIndex - targetIndex); return }
        if (temp[targetIndex].punctuation || temp[draggedIndex].punctuation) { return }
        
        temp[targetIndex].chars = temp[targetIndex].chars.concat(temp[draggedIndex].chars)
        temp = temp.filter(idk => idk.tempKey !== draggedItem?.tempKey)
        setTokens(temp)
        console.log(temp)
    };
    
    const addSentence = async () => {
        type returnTokensType = { characters: string, pinyin: string, punctuation?: boolean }[]
        const returnTokens: returnTokensType = tokens.map(t => ({ characters: t.chars.map(idk => idk.value).join(""), pinyin: t.chars.map(idk => idk.pinyin[idk.index]).join(" "), punctuation: t.punctuation }))
        const response = await post("/main/add-sentence", { token: user.token }, {
            tokens: returnTokens
        })
        if (response.success) {
            navigate("/")
        }
        console.log(response)
    }

    /** ========== JSX ========== **/
    return <div>
        <div className="flex flex-row justify-between">
            <div className="w-full">
                <p className="text-2xl">Add a sentence</p>
                <input value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && characterify()} className="w-2/3 bg-gray-50 border-[1px] rounded-md border-gray-500 p-2" />
                <button className="rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white text-xl w-32 h-10 ml-5" onClick={characterify}>Split</button>
            </div>
        </div>

        <div className="grid grid-cols-10 gap-4 place-items-center p-4 text-white mt-10">
            {
                tokens.map((token, token_index) => token.punctuation ? <p key={token_index} hidden></p> : <div hidden={true} draggable onDragStart={(e) => handleDragStart(e, token)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, token)} key={token_index} className={`min-w-20 h-26 p-2 flex flex-row items-center justify-center ${token.punctuation ? "bg-red-500" : "bg-blue-500"} rounded-md`}>
                    {token.chars.map((char, char_index) => <div key={char_index} onClick={() => { const temp = structuredClone(tokens); temp[token_index].chars[char_index].index = ((char.index + 1) % char.pinyin.length); setTokens(temp) }} className="flex flex-col items-center">
                        { token.punctuation || <p className="text-md mt-1 h-5">{token.punctuation ? "" : char.pinyin[char.index]}</p> }
                        <p className="text-5xl text-center">{char.value}</p>
                    </div>)}
                </div>)
            }
        </div>

        {tokens.length > 0 && <button onClick={addSentence} className="rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white text-xl w-32 h-10 ml-5">Add</button>}
    </div>
}