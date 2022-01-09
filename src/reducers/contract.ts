import { actionTypes } from 'utils/config'

const initialState = {
  web3: null as any,
  contract: null as any,
  price: 0,
  breedPrice: 0,
  upgradePrice: 0,
  statusFlag: 0,
  mintedInitialTokenCount: 0,
  breedTokenCount: 0,
  countLimit: 0,
  INITIAL_TOKEN_COUNT: 0,
  stepBalance: 0,
  balance: 0,
}

const contract = (state = initialState, action: ActionType) => {
  const { type, payload } = action
  switch (type) {
    case actionTypes.CONNECT_WALLET:
    case actionTypes.READ_STATUS:
    case actionTypes.ACCOUNT_STATUS: {
      state = { ...state, ...payload }
      break
    }

    default:
      break
  }

  return state
}

export default contract
