import { h, customElement, useState, useEffect } from 'atomico'
import { useStateStream } from './redditStreamExample'

// Sample array of subreddits to serach
const subreddits = ['frontend', 'reactjs', 'rxjs', 'xstate', 'atomico']

const RxJSReddit = props => {
  const [state, { selectEmit }, startWith] = useStateStream(['idle'])
  const [stateName, stateData] = state

  const [subreddit, setSubreddit] = useState('')
  const [title, setTitle] = useState('-- Select --')

  const changeHandler = e => {
    const sel = e.target
    setTitle(sel.options[sel.selectedIndex].text)
    setSubreddit(sel.value)
  }

  useEffect(() => {
    if (subreddit) {
      startWith(['loading', subreddit])
      selectEmit(subreddit)
    }
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
