import {Store, Update} from '../src'
import {VirtualNode} from 'tweed'
import render from 'tweed/render/string'

describe('Store', () => {
  interface State {
    x: number
    y: string
  }

  const initialState: State = {
    x: 100,
    y: 'y'
  }

  class SetXAction {
    readonly type: 'SetXAction' = 'SetXAction'

    constructor (
      public x: number
    ) {}
  }

  class SetYAction {
    readonly type: 'SetYAction' = 'SetYAction'

    constructor (
      public y: string
    ) {}
  }

  type Action = SetXAction | SetYAction

  const update: Update<State, Action> =
    (state: State, action: Action) => {
      switch (action.type) {
        case 'SetXAction':
          return { ...state, x: action.x }
        case 'SetYAction':
          return { ...state, y: action.y }
      }
    }

  let store: Store<State, Action>

  beforeEach(() => {
    store = new Store<State, Action>(initialState, update)
  })

  it('holds a state', () => {
    expect(store.state).toBe(initialState)
  })

  it('updates the state when an action is dispatched', () => {
    store.dispatch(new SetXAction(101))

    expect(store.state).toEqual({
      x: 101,
      y: 'y'
    })
  })

  it('can be subscribed to', () => {
    let result = initialState

    store.subscribe(state =>
      result = state
    )

    store.dispatch(new SetYAction('changed'))

    expect(result.y).toBe('changed')
  })

  it('works with Tweed', () => {
    let result: any

    class TweedComponent {
      readonly store = store
      render () {
        return <div>{this.store.state.x}</div>
      }
    }

    render(new TweedComponent(), r => result = r)

    expect(result).toBe('<div>100</div>')

    store.dispatch(new SetXAction(123))

    setTimeout(() => {
      expect(result).toBe('<div>123</div>')
    })
  })

  it('binds the dispatch method to the instance', () => {
    const dispatch = store.dispatch

    dispatch(new SetXAction(1234))

    expect(store.state).toEqual({ x: 1234, y: 'y' })
  })
})
