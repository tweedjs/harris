import {Update} from '../src'

describe('Update', () => {
  class IncrementAction {
    readonly type: 'IncrementAction' = 'IncrementAction'
  }

  class DecrementAction {
    readonly type: 'DecrementAction' = 'DecrementAction'
  }

  type Action = IncrementAction | DecrementAction

  const incrementUpdate: Update<number, Action> =
    (state: number, action: Action) => {
      switch (action.type) {
        case 'IncrementAction':
          return state + 1
        default:
          return state
      }
    }

  const decrementUpdate: Update<number, Action> =
    (state: number, action: Action) => {
      switch (action.type) {
        case 'DecrementAction':
          return state - 1
        default:
          return state
      }
    }

  it('can join updates', () => {
    const update = Update.join(incrementUpdate, decrementUpdate)

    expect(update(0, new IncrementAction())).toBe(1)
    expect(update(1, new DecrementAction())).toBe(0)
  })

  it('can combine updates', () => {
    const update = Update.combine({
      incrementing: incrementUpdate,
      decrementing: decrementUpdate,
    })

    let state = {
      incrementing: 0,
      decrementing: 3,
    }

    state = update(state, new IncrementAction())
    state = update(state, new DecrementAction())
    state = update(state, new IncrementAction())
    state = update(state, new DecrementAction())
    state = update(state, new DecrementAction())

    expect(state).toEqual({
      incrementing: 2,
      decrementing: 0,
    })
  })
})
