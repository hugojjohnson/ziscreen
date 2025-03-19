import axios, { AxiosError, AxiosResponse } from "axios";
import { RequestResponse } from "./Interfaces";


// export const baseURL =;
export const baseURL = import.meta.env.DEV ? "http://localhost:3001/ziscreen/" : "https://34.231.62.154.nip.io/ziscreen/"

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

function handleError(err: unknown) {
    if (err instanceof AxiosError && err.response && err.response.data) {
        return { success: false, data: err.response.data, status: err.response.status };
    }
    if (err instanceof AxiosError && err.message) {
        return { success: false, data: err.message, status: 500 };
    }
    return { success: false, data: "An unknown error ocurred.", status: 500 };
}
function handleResponse(response: AxiosResponse<any, any>) {
    if (response.status >= 200 && response.status <= 299) {
        return { success: true, data: response.data, status: response.status }
    }
    return { success: false, data: response.data, status: response.status }
}

export async function get<T>(path: string, params: Record<string, unknown>): Promise<RequestResponse<T>> {
    try {
        const response = await apiClient.get(path, { params })
        return handleResponse(response)
    } catch (err: unknown) {
        return handleError(err)
    }
}

export async function post<T>(path: string, params?: Record<string, unknown>, body?: Record<string, unknown>): Promise<RequestResponse<T>> {
    try {
        const response = await apiClient.post(path, body, { params: params })
        return handleResponse(response)
    } catch (err: unknown) {
        return handleError(err)
    }
}