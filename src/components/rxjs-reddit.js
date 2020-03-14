import { h, customElement, useState, useEffect } from 'atomico'
import { state$ } from './redditStreamExample'

// Sample array of subreddits to serach
const subreddits = ['frontend', 'reactjs', 'rxjs', 'xstate', 'atomico']

const RxJSReddit = props => {
  const [state, setState] = useState(['idle'])
  const [stateName, stateData] = state

  const [subreddit, setSubreddit] = useState('')
  const [title, setTitle] = useState('-- Select --')

  const changeHandler = e => {
    const sel = e.target
    setTitle(sel.options[sel.selectedIndex].text)
    setSubreddit(sel.value)
  }

  useEffect(() => {
    const sub = state$.subscribe(setState)
    if (subreddit) {
      /*
        With RxJS I don't know other simple way to make state through 'loading' state.
        With XState it was part of states description
      */
      setState(['loading', subreddit])
      
      state$.next(['loading', subreddit])
    }
    return () => sub.unsubscribe()
  }, [subreddit])

  return (
    <host shadowDom>
      <style>{style()}</style>
      <main>
        <header>
          <h1 className='rxjs'>Atomico + RxJS</h1>
          <select onchange={changeHandler}>
            <option key='select' value=''>
              {title}
            </option>
            {subreddits.map(subreddit => (
              <option value={subreddit} key={subreddit}>
                {subreddit}
              </option>
            ))}
          </select>
        </header>
        <section>
          <h1>{stateName === 'idle' ? 'Select a subreddit' : title}</h1>
          <div>
            {stateName === 'loading' && <div>Loading {stateData} ...</div>}
            {stateName === 'failed' && <div>{stateData}</div>}
            {stateName === 'loaded' && (
              <ul>
                {stateData
                  .map(child => child.data)
                  .map(post => (
                    <li key={post.title}>{post.title}</li>
                  ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </host>
  )
}
RxJSReddit.props = {}

export default customElement('rxjs-reddit', RxJSReddit)

// Helpers CSS
const style = () => `
:host {
  width: 100%;
  height: 100vh;
}
main {
  margin: 9px;
}
h1.rxjs {
  color: blue;
}
`
