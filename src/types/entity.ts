import { Runtype, Static, create, validationError } from '../runtype'

export type Strategy = "free-text" | "keywords" | "trait";

export interface Entity<A extends Runtype> extends Runtype<Static<A>> {
    tag: "entity";
    strategy: Strategy;
    name: string;
    typ: A;
}

export function Entity<A extends Runtype>(strategy: Strategy, name: string, typ: A) {
    return create<Entity<A>>((x) => {
        if (!typ.check(x))
            throw validationError("Could not validate entity.");
        return x as A;
    }, { tag: "entity", strategy, name, typ });
}
