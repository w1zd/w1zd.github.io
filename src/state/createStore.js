import { createStore as reduxCreateStore } from "redux"

const reducer = (state, action) => {
  if (action.type === `SET_THEME`) {
    localStorage.setItem('theme', action.payload);
    return Object.assign({}, state, {
      theme: action.payload,
    })
  }
  return state
}

const initialState = { theme: localStorage.getItem('theme') || 'Light' }

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore