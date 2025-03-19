import { Dispatch, SetStateAction } from "react";


export interface Sentence {
    _id: string;
    owner: string;
    tokens: string[];
    bucket: number;
    last_reviewed: string;
    flagged: boolean;
    english: string;
}

export interface Token {
    _id: string;
    owner: string;
    characters: string;
    pinyin: string;
    punctuation?: boolean;
    bucket: number;
    last_reviewed: string;
}

export type SafeData = {
    username: string;
    email: string;
    date_joined: string;
    token: string;
    sentences: Sentence[];
    tokens: Token[];
    daily_date: string;
    daily_tokens: string[];
};
export type UserData = SafeData | null | undefined;

export type Safe = [SafeData, Dispatch<SetStateAction<SafeData>>]
export type User = [UserData, Dispatch<SetStateAction<UserData>>]


type RequestResponseSuccess<T> = {
    success: true;
    data: T;
    status: number;
};
type RequestResponseFailure = {
    success: false;
    data: string;
    status: number;
};
export type RequestResponse<T> = RequestResponseSuccess<T> | RequestResponseFailure;
