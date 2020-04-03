/*
  Utility function
  Returns state as stream's emitting value.
  (state$, initialState) -> state
*/
import { useState, useEffect } from 'atomico'

export const useState$ = (state$, initialState) => {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    const sub = state$.subscribe(setState)
    return () => sub.unsubscribe()
  }, [])
  return state
}
