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
const gst = computed([subtotal], subtotal => subtotal * 0.15)
const total = computed([subtotal], subtotal => subtotal * 1.15)
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
    h('input.fl.w-40', {value: item.description, 'ev-change': (e) =>item.description.set(e.target.value)}),
    h('input.fl.w-20', {value: item.qty, 'ev-change': (e) =>item.qty.set(e.target.value)}),
    h('input.fl.w-20', {value: item.price, 'ev-change': (e) =>item.price.set(e.target.value)}),
    h('div.fl.w-20', {}, lineTotal(item)),
    h('button', {'ev-click': () => item.isEditing.set(false)}, 'Done')
  ])
}

function renderItem(item){
  return  h('div.item', {'ev-click': () => item.isEditing.set(true)}, [
    h('div.fl.w-40', {}, item.description),
    h('div.fl.w-20', {}, item.qty),
    h('div.fl.w-20', {}, ['$', item.price]),
    h('div.fl.w-20', {}, ['$', lineTotal(item)]),
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
      h('div.fl.w-40.f3',{}, 'Description'),
      h('div.fl.w-20.f3',{}, 'Qty'),
      h('div.fl.w-20.f3',{}, 'Price'),
      h('div.fl.w-20.f3',{}, 'Total'),
      h('div.pt4', {}, MutantMap(state.lineItems, item => {
        return when(item.isEditing, renderEditingItem(item), renderItem(item))
      }))] 
    ),
    h('div#totals.pt5', {}, [
      h('div', {}, subtotal),
      h('div', {}, gst),
      h('div', {}, total)
    ])
  ])
}

var app = render(state, dispatch)
main.appendChild(app)

