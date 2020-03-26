import { of } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { map, exhaustMap, switchMap, catchError } from 'rxjs/operators'
import { stateStreamFn, eventStreamer } from './stateStreamUtils'

const [select$, selectEmit] = eventStreamer()

const url = subreddit => `https://www.reddit.com/r/${subreddit}.json`
const err$ = message => of(['failed', message])

const state$ = select$.pipe(
  exhaustMap(([_, subreddit]) => fromFetch(url(subreddit))),
  switchMap(res => (res.ok ? res.json() : err$(`Error ${res.status}`))),
  map(json => ['loaded', json.data.children]),
  catchError(err => err$(err.message))
)

// export function with following signature:
// useStateStream:: initialState -> [state, emitters, startWith]
export const useStateStream = stateStreamFn(state$, { selectEmit })
