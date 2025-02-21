import { Dispatch, SetStateAction } from "react";


/** Example interfaces for you to use **/
// export interface Log {
//     _id: string,
//     project: string
//     date: Date;
//     goal: string;
//     notes: string;
// }

// export interface Project {
//     _id: string;
//     coverUrl: string;
//     name: string;
//     goal: string;
//     dateStarted: Date;
//     duration: number;
//     logs: Log[];
// }

export type SafeData = {
    username: string;
    email: string;
    date_joined: Date;
    token: string;
    // projects: Project[];
    // logs: Log[];
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
