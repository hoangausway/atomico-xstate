import { h, customElement } from 'atomico'
import { useMachine } from './useMachine'
import { redditMachineExample } from './redditMachineExample'

// Sample array of subreddits to serach
const subreddits = ['frontend', 'reactjs', 'vuejs']

// Machine instance with internal state
const XStateReddit = props => {
  const [current, send] = useMachine(redditMachineExample)
  const { subreddit, posts } = current.context
  return (
    <host shadowDom>
      <style>{style()}</style>
      <main>
        <header>
          <select
            onchange={e =>
              e.target.value && send('SELECT', { name: e.target.value })}
          >
            <option key='select' value=''>
              --Select--
            </option>
            {subreddits.map(subreddit => {
              return (
                <option value={subreddit} key={subreddit}>
                  {subreddit}
                </option>
              )
            })}
          </select>
        </header>
        <section>
          <h1>{current.matches('idle') ? 'Select a subreddit' : subreddit}</h1>
          {current.matches({ selected: 'loading' }) && <div>Loading...</div>}
          {current.matches({ selected: 'failed' }) && (
            <div>Couldn't load the subreddit '{subreddit}'</div>
          )}
          {current.matches({ selected: 'loaded' }) && (
            <ul>
              {posts.map(post => (
                <li key={post.title}>{post.title}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </host>
  )
}
XStateReddit.props = {}

export default customElement('xstate-reddit', XStateReddit)

// Helpers CSS
const style = () => `
:host {
  width: 100%;
  height: 100vh;
}
main {
  margin: 9px;
}
`
