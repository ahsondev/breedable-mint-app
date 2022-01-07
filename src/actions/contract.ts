import { actionTypes } from 'utils/config'
import { connectToWallet } from 'utils/web3_api'

const wnd: any = window as any

export const connectToMetamask = () => (dispatch: any) => new Promise((resolve, reject) => {
  connectToWallet().then((res: any) => {
    dispatch({
      type: actionTypes.CONNECT_WALLET,
      payload: res
    })
    resolve(res)
  }, (err: any) => {
    reject(err)
  })
})

export const getContractStatus = (contract: any) => (dispatch: any) => new Promise(async (resolve, reject) => {
  if (!contract) {
    return
  }

  try {
    const statusFlag = Number(await contract.methods.statusFlag().call())
    const price = Number(await contract.methods.prices(statusFlag).call())
    const breedPrice = Number(await contract.methods.breedPrice().call())
    const upgradePrice = Number(await contract.methods.upgradePrice().call())
    const mintedInitialTokenCount = Number(await contract.methods.mintedInitialTokenCount().call())
    const breedTokenCount = Number(await contract.methods.breedTokenCount().call())
    const countLimit = Number(await contract.methods.countLimit(statusFlag).call())
    const INITIAL_TOKEN_COUNT = Number(await contract.methods.INITIAL_TOKEN_COUNT().call())

    const payload = {
      price,
      breedPrice,
      upgradePrice,
      statusFlag,
      mintedInitialTokenCount,
      breedTokenCount,
      countLimit,
      INITIAL_TOKEN_COUNT,
    }

    dispatch({
      type: actionTypes.READ_STATUS,
      payload
    })

    resolve(payload)
  } catch (e) {
    reject(e)
  }
})

export const getAccountStatus = (contract: any, account: string) => (dispatch: any) => new Promise(async (resolve, reject) => {
  if (!contract) {
    return
  }

  try {
    const statusFlag = Number(await contract.methods.statusFlag().call())
    const stepBalance = Number(await contract.methods.stepBalance(statusFlag, account).call())

    const payload = {
      stepBalance,
    }

    dispatch({
      type: actionTypes.ACCOUNT_STATUS,
      payload
    })

    resolve(payload)
  } catch (e) {
    console.log(e)
    reject(e)
  }
})
