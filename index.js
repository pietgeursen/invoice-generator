require('setimmediate')
var h = require('@mmckegg/mutant/html-element');
var Struct = require('@mmckegg/mutant/struct');
var computed = require('@mmckegg/mutant/computed');
var MutantArray = require('@mmckegg/mutant/array');

var main = document.querySelector('main')

var state = Struct({ 
  title: 'Counter MUTANT',
  count: 0,
  lineItems: MutantArray([{
    description: 'teaching work',
    qty: 10,
    price: 3
  },{
    description: 'being kewl',
    qty: 2,
    price: 3
  }])
})

const subtotal = computed([state.lineItems], items => items.reduce((sum, item) => { return sum + item.qty * item.price}, 0))
const lineTotal = (item) => computed([item], item => item.qty * item.price)
const line1Total = lineTotal(state.lineItems()[0])

console.log(subtotal())
console.log(line1Total())
line1Total(console.log)
subtotal(console.log)


function mutator(state, action) {
  switch (action.type) {
    case 'SET_TITLE':
      state.title.set(action.payload)
      break;
    case 'INCREMENT_COUNT':
      state.count.set(state.count() + 1)
      break;
    default:
  }
}

function dispatch(action) {
  mutator(state, action) 
}

function render (state, dispatch) {
  return h('div',{}, [
    h('h1', {}, state.title),
    h('div#lines', {}, state.lineItems().map(item => {
      return  h('div.item', {type: 'text'}, [
        h('div', {}, item.description),
        h('div', {}, item.qty),
        h('div', {}, item.price),
        h('div', {}, lineTotal(item)),
      ])
    }) 
      
    )
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

