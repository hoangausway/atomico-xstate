import { Subject, of } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import {
  map,
  exhaustMap,
  switchMap,
  catchError,
  // eslint-disable-next-line
  tap
} from 'rxjs/operators'

const url = subreddit => `https://www.reddit.com/r/${subreddit}.json`
const err$ = message => of(['failed', message])

export const state$ = new Subject().pipe(
  exhaustMap(([_, subreddit]) => fromFetch(url(subreddit))),
  switchMap(res => (res.ok ? res.json() : err$(`Error ${res.status}`))),
  map(json => ['loaded', json.data.children]),
  catchError(err => err$(err.message))
)
