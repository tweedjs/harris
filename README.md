# Harris

A predictable State Container inspired by Redux; in an OOP style.

## Installation
```shell
npm install --save harris
```

## Usage
```typescript
import {Store, Update} from 'harris'

// First, we define our model. In our case,
// a simple number is fine.
type Model = number

// Next, we define a few actions. Here is
// an action for incrementing the model.
class IncrementAction {
  // Note that the type of the `type` field
  // is a string literal. This is important,
  // so remember it.
  readonly type: 'Increment' = 'Increment'
}

// Here we have a corresponding decrement
// action. Note also that these actions are
// classes, and can contain context data
// which can be conveniently injected in
// the constructor.
class DecrementAction {
  readonly type: 'Decrement' = 'Decrement'
}

// We declare a union of all the different
// action types for future reference.
type Action = IncrementAction | DecrementAction

// We define the initial state of our app.
const initialState: Model = 0

// Here is an Update. Updates describe the
// transitions from one state to another,
// given an action object.
const update: Update<Model, Action> =
  (state: Model, action: Action): Model => {
    // Here, because all actions have a
    // literal `type` field, the compiler
    // knows that `action.type` here has
    // the type `'Increment' | 'Decrement'`.
    switch (action.type) {
      case 'Increment':
        // The TypeScript compiler is smart
        // enough to understand that since
        // `action.type` apparently is
        // `'Increment'`, `action` must be
        // an `IncrementAction`.
        return state + 1

      case 'Decrement':
        return state - 1
    }
  }

// Using an initial state and an update function
// we can create a `Store`, which is a mutable
// object containing the state of the app.
const store = new Store(initialState, update)

// We can access the current state like so
store.state // === 0

// The only way to mutate a `Store` is by dispatching
// an `Action`. Like this:
store.dispatch(new IncrementAction())

// The Store then uses the `Update` function to
// figure out the next state.
store.state // === 1

// We can get notified of updates automatically by
// subscribing to the store:
store.subscribe(state => {
  console.log('State updated:', state)
})
```

## First Class Tweed Support
If you're using [Tweed](https://tweedjs.github.io), the `Store` class will automatically
update the UI when a command is dispatched:

```typescript
import {Store, Update} from 'harris'
import {VirtualNode} from 'tweed'
import render from 'tweed/render/dom'

class AddAction {
  readonly type: 'Add' = 'Add'

  constructor (
    public readonly value: number
  ) {}
}

type Model = number
type Action = AddAction | ...

const update: Update<Model, Action> =
  (state: Model, action: Action): Model => {
    switch (action.type) {
      case 'Add':
        return state + action.value
      default:
        return state
    }
  }

class Root {
  readonly store = new Store<Model, Action>(0, update)

  render () {
    const onClick = () => this.store.dispatch(new AddAction(1))

    return (
      <button on-click={onClick}>
        Clicked {this.store.state} times
      </button>
    )
  }
}

render(new Root(), document.querySelector('#root'))
```
