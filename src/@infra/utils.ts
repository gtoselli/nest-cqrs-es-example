export type ClassNotInstanceOf<T> = new (...args) => T;

export function elapsedFrom(from: number): number {
    return Date.now() - from;
}

export function wait(timeout: number) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}
