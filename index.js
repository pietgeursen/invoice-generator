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

function renderEditingItem(item){
  return  h('div.item', {}, [
    h('input.fl.w-30', {value: item.description, 'ev-change': (e) =>item.description.set(e.target.value)}),
    h('input.fl.w-20.tr', {value: item.qty, 'ev-change': (e) =>item.qty.set(e.target.value)}),
    h('input.fl.w-20.tr', {value: item.price, 'ev-change': (e) =>item.price.set(e.target.value)}),
    h('div.fl.w-20.tr', {}, lineTotal(item)),
    h('button.fr', {'ev-click': () => item.isEditing.set(false)}, 'Done')
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
        return when(item.isEditing, renderEditingItem(item), renderItem(item))
      }))] 
    ),
    h('div#totals.pt5.fr', {}, [
      h('div', {}, subtotal),
      h('div', {}, gst),
      h('div', {}, total)
    ])
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

