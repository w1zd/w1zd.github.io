import { createStore as reduxCreateStore } from "redux"

const isBrowser = typeof window !== "undefined"

const reducer = (state, action) => {
  if (action.type === `SET_THEME`) {
    localStorage.setItem('theme', action.payload);
    return Object.assign({}, state, {
      theme: action.payload,
    })
  }
  return state
}
const initialState = { theme: isBrowser ? localStorage.getItem('theme') || 'Light' : 'Light' }

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore