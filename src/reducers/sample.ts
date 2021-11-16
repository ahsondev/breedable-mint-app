import { actionTypes } from 'utils/config'

const initialState = {
  data: {} as any,
}

const sample = (state = initialState, action: ActionType) => {
  const { type, payload } = action
  switch (type) {
    case actionTypes.SAMPLE_ACTION: {
      state = { ...state, data: payload }
      break
    }

    default:
      break
  }

  return state
}

export default sample
