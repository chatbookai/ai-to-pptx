type AnyFunction<A = any> = (...args: any[]) => A
type ClassConstructor<T = {}> = new (...args: any[]) => T
type MixinType<T extends AnyFunction> = InstanceType<ReturnType<T>>
type Null = null | undefined | void

type Override<T, U> = Omit<T, keyof U> & U

type Flatten<T> = T extends Record<string, any> ? { [k in keyof T]: T[k] } : never
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type ExtraProperties <T> = { [key in keyof UnionToIntersection<T>]?: key extends keyof T ? T[key] : Partial<UnionToIntersection<T>>[key] }
type Widen<T> = T & ExtraProperties<T>

type AsConst<T> = { readonly [P in keyof T]: T[P] extends object ? AsConst<T[P]> : T[P] }

type ReplaceType<T, OldType, NewType> = T extends OldType ? NewType
	: T extends (...args: infer Args) => infer R ? (...args: ReplaceArrayType<Args, OldType, NewType>) => R
		: T extends object ? { [K in keyof T]: ReplaceType<T[K], OldType, NewType> }
			: T

type ReplaceArrayType<T extends any[], OldType, NewType> = T extends [] ? []
	: T extends [infer Head, ...infer Tail] ? [ReplaceType<Head, OldType, NewType>, ...ReplaceArrayType<Tail, OldType, NewType>]
		: T