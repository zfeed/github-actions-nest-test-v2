/// <reference types="jest-extended" />

interface GameStorage {
    [index: string]: object;
}

interface FieldStorage {
    [index: string]: object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripInternalMethods<T, K extends keyof any> = Omit<T, K>;

declare namespace NodeJS {
    export interface Process {
        NODE_ENV: string;
    }
}
