import { Dispatch, SetStateAction } from "react";


export interface Sentence {
    _id: string;
    owner: string;
    tokens: string[];
    bucket: number;
    last_reviewed?: Date;
    flagged: boolean;
}

export interface Token {
    _id: string;
    owner: string;
    characters: string;
    pinyin: string;
    punctuation?: boolean;
    correct: [number];
}

export type SafeData = {
    username: string;
    email: string;
    date_joined: Date;
    token: string;
    sentences: Sentence[];
    tokens: Token[];
};
export type UserData = SafeData | null | undefined;

export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]


type RequestResponseSuccess<T> = {
    success: true;
    data: T;
    status?: number;
};
type RequestResponseFailure = {
    success: false;
    data: string;
    status?: number;
};
export type RequestResponse<T> = RequestResponseSuccess<T> | RequestResponseFailure;
