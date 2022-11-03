export type ClassNotInstanceOf<T> = new (...args) => T;

export function elapsedFrom(from: number): number {
    return Date.now() - from;
}
