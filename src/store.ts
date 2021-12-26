import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

import contract from 'reducers/contract'

const store = createStore(combineReducers({contract}), applyMiddleware(thunkMiddleware))

export default store
