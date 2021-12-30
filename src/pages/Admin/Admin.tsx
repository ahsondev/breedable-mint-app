import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import api from 'utils/api'
import './Admin.scoped.scss'
import { decrypt, headerToken } from 'utils/helper'
import { NotificationManager } from 'components/Notification'
import {connectToMetamask, getAccountStatus, getContractStatus} from 'actions/contract'
import { useDispatch, useSelector } from 'react-redux'

const wnd = window as any

interface Props {}

const Admin = (props: Props) => {
  const [loading, setLoading] = useState(false)
  
  const web3 = useSelector((state: any) => state.contract.web3)
  const contract = useSelector((state: any) => state.contract.contract)
  const dispatch = useDispatch() as any

  useEffect(() => {
    dispatch(connectToMetamask())
  }, [])

  const handlePresale = async () => {
    setLoading(true)
    try {
      const addr = window.ethereum.selectedAddress
      const contractBD = new BrainDance(contract)
      await contractBD.setStatusFlag(addr, 2)
      await api.post('/set-starttime', {
        address: addr
      }, {
        headers: headerToken(addr)
      })
      NotificationManager.success('Presale was set successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Presale was not set successfully', 'Error')
    }
    setLoading(false)
  }

  const handlePublicSale1 = async () => {
    setLoading(true)
    try {
      const addr = window.ethereum.selectedAddress
      const contractBD = new BrainDance(contract)
      await contractBD.setStatusFlag(addr, 3)
      await api.post('/set-starttime', {
        address: addr
      }, {
        headers: headerToken(addr)
      })
      NotificationManager.success('Public sale (24hours) was set successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Public sale (24hours) not set successfully', 'Error')
    }
    setLoading(false)
  }

  const handlePublicSale2 = async () => {
    setLoading(true)
    try {
      const addr = window.ethereum.selectedAddress
      const contractBD = new BrainDance(contract)
      await contractBD.setStatusFlag(addr, 4)
      NotificationManager.success('Public sale (24hours) was set successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Public sale (24hours) not set successfully', 'Error')
    }
    setLoading(false)
  }
  
  const handleUpgrade = async () => {
    const {data} = await api.get('/token')
    const sign = decrypt(data.token)
    const tokenUri = "/upgrade"
    const tokenId = 1
    const heroTraits = 0
    const heroBirthday = 1
    const fId = 1
    const mId = 2
    const cIds = [3, 4]
    const reset = false

    console.log({sign})
    const tx = {
      from: window.ethereum.selectedAddress,
      to: contractConfig.contractAddress,
      data: contract.methods.setToken(sign, tokenId, tokenUri, heroTraits, heroBirthday, fId, mId, cIds, reset).encodeABI(),
    }

    return web3.eth.sendTransaction(tx)
  }

  const handleBreed = async () => {
    const {data} = await api.get('/token')
    const sign = decrypt(data.token)
    const tokenUri = "https://braindance.mypinata.cloud/ipfs/QmTUCeRzdte43ngBLctLSSzMzs1JrRjkexryCNzXgMj4UH/9999"
    const heroId1 = 1
    const heroId2 = 2

    console.log({sign})
    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); // nonce starts counting from 0
    const tx = {
      from: window.ethereum.selectedAddress,
      to: contractConfig.contractAddress,
      value: 0,
      gas: 300000,
      maxPriorityFeePerGas: 1999999987,
      nonce,
      // data: contract.methods.mintBreedToken(sign, tokenUri, heroId1, heroId2).encodeABI(),
      data: contract.methods.mintBreedToken(sign, tokenUri, heroId1, heroId2).encodeABI(),
    }

    return web3.eth.sendTransaction(tx)
  }

  const isOwner = () => {
    const addr = "0x52A9351CCF73Db3f0ab25977a30eE592c3F1b9fa".toLowerCase();
    const deployer = contractConfig.deployer.toLowerCase();
    const curAddr = window.ethereum.selectedAddress.toLowerCase();
    return [addr, deployer].includes(curAddr);
  }

  return (
    <div className='home-page'>
      {isOwner() && (
        <>
          <div>
            <button type='button' onClick={handlePresale}>start presale</button>
            <button type='button' onClick={handlePublicSale1}>start public sale (24hours)</button>
            <button type='button' onClick={handlePublicSale2}>start public sale (without 24hours)</button>
          </div>
        </>
      )}
      <div>
        <button type='button' onClick={handleUpgrade}>upgrade</button>
        <button type='button' onClick={handleBreed}>breed</button>
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Admin
