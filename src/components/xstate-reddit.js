import { h, customElement } from 'atomico'
import { Machine, assign } from 'xstate'
import { useMachine } from './useMachine'

/* Object 'invoke':
  - Function at 'src' will be called and return promise
  - If done, enter state 'loaded' and assign 'event.data' to 'posts' context variable
  - If error, simply enter state 'failed'. Process error further is out of scope of this demo.
*/
const invoke = {
  id: 'fetch-subreddit',
  // Fetch subreddit once entered 'loadding' state
  src: context =>
    fetch(`https://www.reddit.com/r/${context.subreddit}.json`)
      .then(response => response.json())
      .then(json => json.data.children.map(child => child.data)),
  onDone: {
    target: 'loaded',
    actions: assign({ posts: (context, event) => event.data })
  },
  onError: 'failed'
}

/*
  Object 'onSelect':
  - When 'SELECT' event happen, enter 'selected' state
  - Assign 'event.name' to 'subreddit' context variable
*/
const onSelect = {
  SELECT: {
    target: '.selected',
    actions: assign({
      subreddit: (context, event) => event.name
    })
  }
}

// Machine's overall object
const machineConfig = {
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null, // none selected
    posts: null
  },
  states: {
    idle: {},
    // Compound state: has 3 sub-states as 'loading', 'loaded' and 'failed'
    selected: {
      initial: 'loading',
      states: {
        loading: { invoke },
        loaded: {},
        failed: {}
      }
    }
  },
  on: onSelect
}

const redditMachine = Machine(machineConfig)

// Sample array of subreddits to serach
const subreddits = ['frontend', 'reactjs', 'vuejs']

// Machine instance with internal state
const XStateReddit = props => {
  const [current, send] = useMachine(redditMachine)
  const { subreddit, posts } = current.context
  return (
    <host shadowDom>
      <style>{style()}</style>
      <main>
        <header>
          <select onchange={e => e.target.value && send('SELECT', { name: e.target.value })}>
            <option key='select' value=''>--Select--</option>
            {subreddits.map(subreddit => {
              return <option value={subreddit} key={subreddit}>{subreddit}</option>
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
