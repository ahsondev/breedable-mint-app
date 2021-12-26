import { actionTypes } from 'utils/config'

const initialState = {
  web3: null as any,
  contract: null as any,
  price: 0,
  statusFlag: 0,
  presaleReservedTokenCount: 0,
  presaleReservedAddressCount: 0,
  presaleTokenCount: 0,
  presaleAddressLimit: 0,
  ticketCount: 0,
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
