import { Subject } from 'rxjs'
import { useState, useEffect } from 'atomico'

export const eventStreamer = () => {
  const eventStream$ = new Subject()
  const eventEmitter = e => eventStream$.next(e)
  return [eventStream$, eventEmitter]
}

export const stateStreamFn = (state$, emitters) => initialState => {
  const [state, setState] = useState(initialState)

  // in case have to force start with some state
  const startWith = state => {
    setState(state)
    state$.next(state)
  }

  useEffect(() => {
    const sub = state$.subscribe(setState)
    return () => sub.unsubscribe()
  }, [])

  return [state, emitters, startWith]
}
