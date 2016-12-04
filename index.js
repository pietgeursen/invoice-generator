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
  invoiceNumber: 38,
  date: '4 December 2016',
  user: Struct({
    userName: 'Piet Geursen',
    bankAccount: '38-900103434343',
    phone: '+64274243',
    gst: '71-590-',
    address: '',
    email: ''
  }),
  client: Struct({
    clientName: 'Enspiral Dev Academy',
    address: ''
  }),
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
  return h('div#app',{}, [
    h('div#title', {}, [
      h('h1', {}, state.title),
    ]),
    h('div#header', {}, [
      h('div', {}, [
        h('div', {}, ['Invoice #', state.invoiceNumber]),
        h('div', {}, state.date),
        h('div', {}, ['GST: ', state.user.gst]),
      ]),
      h('div', {}, [
        h('h2', {}, 'Invoice'),
        h('div', {}, state.client.clientName),
      ])
    ]),
    h('div#lines', {}, MutantMap(state.lineItems, item => {
      return when(item.isEditing, renderEditingItem(item), renderItem(item))
    }) 
    )
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

