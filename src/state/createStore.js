import { createStore as reduxCreateStore } from "redux"

const isBrowser = typeof window !== "undefined"

const reducer = (state, action) => {
  if (action.type === `SET_THEME`) {
    return Object.assign({}, state, {
      isDarkMode: action.payload,
    })
  }
  return state
}
const initialState = { isDarkMode: false }

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore