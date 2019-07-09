export type FixedSizeArray<T, N extends number> =
    { 0: any, length: N } & ReadonlyArray<T>

export function map <A, B, L extends number>(fn: (item: A) => B, array: FixedSizeArray<A, L>) : FixedSizeArray<B, L> {
    const mappedArray = array.map(fn) as any
    return mappedArray as FixedSizeArray<B, L>
}