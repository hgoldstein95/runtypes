import { Runtype, create, Static, validationError } from '../runtype'
import { Record } from './record'

export interface StringDictionary<V extends Runtype> extends Runtype<{ [_: string]: Static<V> }> {
  tag: 'dictionary'
  key: 'string'
  value: V
}

export interface NumberDictionary<V extends Runtype> extends Runtype<{ [_: number]: Static<V> }> {
  tag: 'dictionary'
  key: 'number'
  value: V
}

/**
 * Construct a runtype for arbitrary dictionaries.
 */
export function Dictionary<V extends Runtype>(value: V, key?: 'string'): StringDictionary<V>
export function Dictionary<V extends Runtype>(value: V, key?: 'number'): NumberDictionary<V>
export function Dictionary<V extends Runtype>(value: V, key = 'string'): any {
  return create<Runtype>(x => {
    Record({}).check(x)

    if (typeof x !== 'object')
      throw validationError(`Expected an object but was ${typeof x}`)

    if (Object.getPrototypeOf(x) !== Object.prototype) {
      if (!Array.isArray(x))
        throw validationError(`Expected simple object but was complex`)
      else if (key === 'string')
        throw validationError(`Expected dictionary but was array`)
    }

    for (const k in x) {
      // Object keys are always strings
      if (key === 'number') {
        if (isNaN(+k))
          throw validationError(`Expected dictionary key to be a number but was string`)
      }
      value.check((x as any)[k])
    }

    return x
  }, { tag: 'dictionary', key, value })
}
