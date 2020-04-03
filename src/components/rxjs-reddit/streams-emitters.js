import { of, concat } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import {
  map,
  exhaustMap,
  switchMap,
  catchError,
  flatMap,
  tap
} from 'rxjs/operators'
import { streaming } from './util-streaming'

const [select$, selectEmit] = streaming()

const url = subreddit => `https://www.reddit.com/r/${subreddit}.json`
const err$ = (subreddit, message) => of(['failed', subreddit, message])

const loading = subreddit => of(['loading', subreddit])
const load = subreddit =>
  of(subreddit).pipe(
    exhaustMap(subreddit => fromFetch(url(subreddit))),
    switchMap(res =>
      res.ok ? res.json() : err$(subreddit, `Error ${res.status}`)
    ),
    map(json => ['loaded', subreddit, json.data.children]),
    catchError(err => err$(subreddit, err.message))
  )

const state$ = select$.pipe(
  flatMap(subreddit => concat(loading(subreddit), load(subreddit))),
  tap(console.log)
)
export default [state$, selectEmit]
