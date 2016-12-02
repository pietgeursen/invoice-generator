require('setimmediate')
var reducer = require('./reducer')
var h = require('@mmckegg/mutant/html-element');
var Struct = require('@mmckegg/mutant/struct');

var main = document.querySelector('main')

var state = Struct({ 
  title: 'Counter MUTANT',
  count: 0
})

function dispatch(action) {
  reducer(state, action) 
}

function render (state, dispatch) {
  return h('div',{}, [
    h('h1', {}, state.title),
    h('h2', 
      {'ev-click': () => dispatch({type: 'INCREMENT_COUNT'}) }, 
      ['My count is: ', state.count])
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

