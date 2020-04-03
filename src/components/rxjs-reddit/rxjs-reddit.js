import { h, customElement } from 'atomico'
import StreamsEmitters from './streams-emitters'
import { useState$ } from './util-usestate$'

// Sample array of subreddits to serach
const subreddits = ['frontend', 'reactjs', 'rxjs']

const RxJSReddit = props => {
  const [state$, selectEmit] = StreamsEmitters
  const state = useState$(state$, ['idle'])
  const [name, subreddit, payload] = state

  const changeHandler = e => e.target.value && selectEmit(e.target.value)

  return (
    <host shadowDom>
      <style>{style()}</style>
      <main>
        <header>
          <h1 className='rxjs'>Atomico + RxJS</h1>
          <select onchange={changeHandler}>
            <option key='select' value=''>
              -- Select --
            </option>
            {subreddits.map(subreddit => (
              <option value={subreddit} key={subreddit}>
                {subreddit}
              </option>
            ))}
          </select>
        </header>
        <section>
          <h1>{name === 'idle' ? 'Select a subreddit' : subreddit}</h1>
          <div>
            {name === 'loading' && <div>Loading {payload} ...</div>}
            {name === 'failed' && <div>{payload}</div>}
            {name === 'loaded' && (
              <ul>
                {payload
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
