import { Machine, assign } from 'xstate'

/* Object 'invoke':
  - Function at 'src' will be called and return promise
  - If done, enter state 'loaded' and assign 'event.data' to 'posts' context variable
  - If error, simply enter state 'failed'. Process error further is out of scope of this demo.
*/
const url = subreddit => `https://www.reddit.com/r/${subreddit}.json`
const invoke = {
  id: 'fetch-subreddit',
  // Fetch subreddit once entered 'loadding' state
  src: context =>
    fetch(url(context.subreddit))
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

export const redditMachineExample = Machine(machineConfig)
