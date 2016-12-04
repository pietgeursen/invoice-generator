module.exports = (state, action) => {
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
