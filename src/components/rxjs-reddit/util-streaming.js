/*
  Utility function
  Return a pair of stream and it's trigger
*/
import { Subject } from 'rxjs'

export const streaming = () => {
  const stream$ = new Subject()
  const eventEmit = e => stream$.next(e)
  return [stream$, eventEmit]
}
