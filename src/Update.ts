export type Update <S, A> = (state: S, action: A) => S

export type UpdatesFor <S, A> = {
  [P in keyof S]: Update<S[P], A>
}

export namespace Update {
  export function join <S, A> (...updates: Update<S, A>[]): Update<S, A> {
    return (state: S, action: A): S => {
      return updates.reduce(
        (state, update) => update(state, action),
        state
      )
    }
  }

  export function combine <S, A> (updates: UpdatesFor<S, A>): Update<S, A> {
    return (state: S, action: A): S => {
      const newState: S = {} as any

      for (const prop in updates) {
        newState[prop] = updates[prop](state[prop], action)
      }

      return newState
    }
  }
}
