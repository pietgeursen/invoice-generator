require('setimmediate')
var h = require('@mmckegg/mutant/html-element');
var Struct = require('@mmckegg/mutant/struct');
var computed = require('@mmckegg/mutant/computed');
var MutantArray = require('@mmckegg/mutant/array');
var MutantMap = require('@mmckegg/mutant/map');
var Value = require('@mmckegg/mutant/value');
var when = require('@mmckegg/mutant/when');

var main = document.querySelector('main')

var state = Struct({ 
  title: 'Counter MUTANT',
  count: 0,
  lineItems: MutantArray([Struct({
    description: 'teaching work',
    qty: 10,
    price: 3,
    isEditing: false
  }),Struct({
    description: 'being kewl',
    qty: 2,
    price: 3,
    isEditing: true
  })])
})


const subtotal = computed([state.lineItems], items => items.reduce((sum, item) => { return sum + item.qty * item.price}, 0))
const lineTotal = (item) => computed([item], item => item.qty * item.price)
const line1Total = lineTotal(state.lineItems()[0])

console.log(subtotal())
console.log(line1Total())
line1Total(console.log)
subtotal(console.log)
state(console.log)

function mutator(state, action) {
  switch (action.type) {
  }
}

function dispatch(action) {
  mutator(state, action) 
}

function renderEditingItem(item){
  return  h('div.item', {}, [
    h('input', {value: item.description, 'ev-change': (e) =>item.description.set(e.target.value)}),
    h('input', {value: item.qty, 'ev-change': (e) =>item.qty.set(e.target.value)}),
    h('input', {value: item.price, 'ev-change': (e) =>item.price.set(e.target.value)}),
    h('div', {}, lineTotal(item)),
    h('button', {'ev-click': () => item.isEditing.set(false)}, 'Done')
  ])
}

function renderItem(item){
  return  h('div.item', {'ev-click': () => item.isEditing.set(true)}, [
    h('div', {}, item.description),
    h('div', {}, item.qty),
    h('div', {}, item.price),
    h('div', {}, lineTotal(item)),
  ])
}


function render (state, dispatch) {
  return h('div',{}, [
    h('h1', {}, state.title),
    h('div#lines', {}, MutantMap(state.lineItems, item => {
      return when(item.isEditing, renderEditingItem(item) , renderItem(item))
    }) 
    )
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

