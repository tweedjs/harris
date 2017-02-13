import {Update} from './Update'
import {mutating} from './tweed'

export type StoreListener <S, A> =
  (store: S) => any

export class Store <S, A> {
  @mutating
  private _state: S
  private readonly _update: Update<S, A>
  private _listeners: StoreListener<S, A>[] = []

  constructor (initialState: S, update: Update<S, A>) {
    this._state = initialState
    this._update = update

    this.dispatch = this.dispatch.bind(this)
  }

  get state () {
    return this._state
  }

  dispatch (action: A): void {
    this._state = this._update(this._state, action)

    for (const listener of this._listeners) {
      listener(this._state)
    }
  }

  subscribe (listener: StoreListener<S, A>) {
    this._listeners.push(listener)
  }

  unsubscribe (listener: StoreListener<S, A>) {
    this._listeners.splice(this._listeners.indexOf(listener), 1)
  }
}
