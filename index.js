require('setimmediate')
//var levelup = require('levelup');
//var localstorage = require('localstorage-down');
//var pull = require('pull-stream');
//var pl = require('pull-level');
var h = require('mutant/html-element');
var Struct = require('mutant/struct');
var computed = require('mutant/computed');
var MutantArray = require('mutant/array');
var MutantMap = require('mutant/map');
var Value = require('mutant/value');
var when = require('mutant/when');



var initialstate = { 
  title: 'Counter MUTANT',
  invoiceNumber: 38,
  date: '4 December 2016',
  user: {
    userName: 'Piet Geursen',
    bankAccount: '38-900103434343',
    phone: '+64274243',
    gst: '71-590-',
    address: '',
    email: ''
  },
  client: {
    clientName: 'Enspiral Dev Academy',
    address: ''
  },
  lineItems: ([{
    description: 'teaching work',
    qty: 10,
    price: 3,
    isEditing: false
  },{
    description: 'being kewl',
    qty: 2,
    price: 3,
    isEditing: true
  }])
}

function stateToObservable(state) {
  const lineItems = MutantArray(state.lineItems.map(Struct))
  const user = Struct(state.user)
  var newState = Object.assign({}, state, {lineItems, user})
  return Struct(newState) 
}

function Item(ob) {
  var _ob = ob || {description: '', qty: 0, price: 0, isEditing: Value(true)}
  return Struct(_ob)
}
//var db = levelup('invoices', {db: localstorage})
//
var state = stateToObservable(initialstate)
//
//
//pull(
//  pl.read(db),
//  pull.drain(storeState => {
//    var newState = JSON.parse(storeState.value) 
//    state.set(newState)
//  })
//)
//
//state(state => {
//  var str = JSON.stringify(state)
//  db.put('state', str)
//})

const subtotal = computed([state.lineItems], items => items.reduce((sum, item) => { return sum + item.qty * item.price}, 0).toFixed(2))
const gst = computed([subtotal], subtotal => (subtotal * 0.15).toFixed(2))
const total = computed([subtotal], subtotal => (subtotal * 1.15).toFixed(2))
const lineTotal = (item) => computed([item], item => (item.qty * item.price).toFixed(2))


function mutator(state, action) {
  switch (action.type) {
  }
}

function dispatch(action) {
  mutator(state, action) 
}

function renderEditingItem(item, items){
  return  h('div.item', {}, [
    h('input.fl.w-30', {value: item.description, 'ev-change': (e) =>item.description.set(e.target.value)}),
    h('input.fl.w-20.tr', {value: item.qty, 'ev-change': (e) =>item.qty.set(e.target.value)}),
    h('input.fl.w-20.tr', {value: item.price, 'ev-change': (e) =>item.price.set(e.target.value)}),
    h('div.fl.w-20.tr', {}, lineTotal(item)),
    h('button.fr', {'ev-click': () => item.isEditing.set(false)}, 'Done'),
    h('button.fr', {'ev-click': () => {
      items.delete(item)
    }}, 'Remove'),
    h('button.fr', {'ev-click': () => items.push(Item())}, 'Add')
  ])
}

function renderItem(item){
  return  h('div.item', {'ev-click': () => item.isEditing.set(true)}, [
    h('div.fl.w-30', {}, item.description),
    h('div.fl.w-20.tr', {}, item.qty),
    h('div.fl.w-20.tr', {}, ['$', item.price]),
    h('div.fl.w-20.tr', {}, ['$', lineTotal(item)]),
  ])
}


function render (state, dispatch) {
  return h('div#app.ph4',{}, [
    h('div#title.pv4', {}, [
      h('div.f1', {}, state.user.userName),
    ]),
    h('div#header', {}, [
      h('div.fl.w-25', {}, [
        h('div', {}, ['Invoice #', state.invoiceNumber]),
        h('div', {}, state.date),
        h('div', {}, ['GST: ', state.user.gst]),
      ]),
      h('div.fl.w-75', {}, [
        h('div.f2.tr', {}, 'Invoice'),
        h('div.f3.tr', {}, state.client.clientName),
      ])
    ]),
    h('div#items.pt6', {}, [
      h('div.fl.w-30.f3',{}, 'Description'),
      h('div.fl.w-20.f3.tr',{}, 'Qty'),
      h('div.fl.w-20.f3.tr',{}, 'Price'),
      h('div.fl.w-20.f3.tr',{}, 'Total'),
      h('div.pt4', {}, MutantMap(state.lineItems, item => {
        console.log('mapping on item.editing:', item.isEditing)
        return when(item.isEditing, renderEditingItem(item, state.lineItems), renderItem(item))
      }, 
      {onRemove: (obs) => console.log('onRemove with:', obs())}
      ))] 
    ),
    h('div#totals.pt5.fr', {}, [
      h('div', {}, subtotal),
      h('div', {}, gst),
      h('div', {}, total)
    ])
  ])
}

var app = render(state, dispatch)
var main = document.querySelector('main')
main.appendChild(app)

