import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

import sample from 'reducers/sample'

const store = createStore(combineReducers({sample}), applyMiddleware(thunkMiddleware))

export default store
