export type ObjType<T, KS extends string> = {[K in KS]: T};

export type Nullable<T> = T | null;