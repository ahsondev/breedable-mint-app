import { useEffect, useState } from 'react'
import { BrainDance } from 'utils/web3_api'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import api from 'utils/api'
import './Admin.scoped.scss'
import { decrypt, headerToken } from 'utils/helper'
import { NotificationManager } from 'components/Notification'
import {connectToMetamask} from 'actions/contract'
import { useDispatch, useSelector } from "react-redux"

const wnd = window as any

interface Props {}

const Admin = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [rootValue, setRootValue] = useState('')
  
  const web3 = useSelector((state: any) => state.contract.web3)
  const contract = useSelector((state: any) => state.contract.contract)
  const dispatch = useDispatch() as any

  useEffect(() => {
    dispatch(connectToMetamask())
  }, [])

  const handleSetStatus = async (statusFlag: number) => {
    setLoading(true)
    try {
      const addr = window.ethereum.selectedAddress
      const contractBD = new BrainDance(contract)
      await contractBD.setStatusFlag(addr, statusFlag)
      await api.post('/admin/set-starttime', {
        address: addr
      }, {
        headers: headerToken(addr)
      })
      NotificationManager.success('Operation was done successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Operation was not done successfully', 'Error')
    }
    setLoading(false);
  }

  const handleGetRoot = async (statusFlag: number, bSet: boolean) => {
    setLoading(true)
    try {
      const url = statusFlag === 4 ? '/admin/get-sign-root' : '/admin/get-whitelist-root'
      const addr = window.ethereum.selectedAddress
      const {data} = await api.post(url, {
        address: addr,
        step: statusFlag
      }, {
        headers: headerToken(addr)
      })

      setRootValue(data.root)

      if (bSet) {
        const contractBD = new BrainDance(contract)
        statusFlag === 4 ? await contractBD.setRootSign(addr, data.root) : await contractBD.setRootVip(addr, statusFlag, data.root)
      }
      NotificationManager.success('Operation was done successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Operation was not done successfully', 'Error')
    }
    setLoading(false);
  }
  
  const handleUpgrade = async () => {
    setLoading(true)
    const addr = window.ethereum.selectedAddress;
    const {data} = await api.post('/admin/get-proof', {
      address: addr,
    }, {
      headers: headerToken(addr)
    });

    const tokenUri = "https://braindance.mypinata.cloud/ipfs/QmTUCeRzdte43ngBLctLSSzMzs1JrRjkexryCNzXgMj4UH/9998"
    const heroId1 = 1
    const heroId2 = 3

    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); // nonce starts counting from 0
    const tx = {
      from: window.ethereum.selectedAddress,
      to: contractConfig.contractAddress,
      value: 0,
      gas: 300000,
      maxPriorityFeePerGas: 1999999987,
      nonce,
      // data: contract.methods.mintBreedToken(sign, tokenUri, heroId1, heroId2).encodeABI(),
      data: contract.methods.setToken(data.proof, data.leaf, 1, tokenUri, 0, heroId1, heroId2, true).encodeABI(),
    }

    await web3.eth.sendTransaction(tx);
    setLoading(false);
  }

  const handleBreed = async () => {
    setLoading(true)
    const addr = window.ethereum.selectedAddress;
    const {data} = await api.post('/admin/get-proof', {
      address: addr,
    }, {
      headers: headerToken(addr)
    });

    const tokenUri = "https://braindance.mypinata.cloud/ipfs/QmTUCeRzdte43ngBLctLSSzMzs1JrRjkexryCNzXgMj4UH/9999"
    const heroId1 = 1
    const heroId2 = 2

    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); // nonce starts counting from 0
    const tx = {
      from: window.ethereum.selectedAddress,
      to: contractConfig.contractAddress,
      value: 0,
      gas: 300000,
      maxPriorityFeePerGas: 1999999987,
      nonce,
      // data: contract.methods.mintBreedToken(sign, tokenUri, heroId1, heroId2).encodeABI(),
      data: contract.methods.mintBreedToken(data.proof, data.leaf, tokenUri, heroId1, heroId2).encodeABI(),
    }

    await web3.eth.sendTransaction(tx);
    setLoading(false);
  }

  const isOwner = () => {
    const addr = "0x52A9351CCF73Db3f0ab25977a30eE592c3F1b9fa".toLowerCase();
    const deployer = contractConfig.deployer.toLowerCase();
    const curAddr = window?.ethereum?.selectedAddress?.toLowerCase();
    return [addr, deployer].includes(curAddr);
  }

  return (
    <div className='home-page'>
      {isOwner() && (
        <div>
          <div>
            <h2>Step</h2>
            <button type='button' onClick={() => handleSetStatus(0)}>set as not-started</button>
            <button type='button' onClick={() => handleSetStatus(1)}>start VIP1</button>
            <button type='button' onClick={() => handleSetStatus(2)}>start VIP2</button>
            <button type='button' onClick={() => handleSetStatus(3)}>start VIP3</button>
            <button type='button' onClick={() => handleSetStatus(4)}>start Public Sale</button>
            <button type='button' onClick={() => handleSetStatus(5)}>set as ended</button>
            <button type='button' onClick={() => handleSetStatus(6)}>set paused</button>
          </div>
          <div>
            <h2>Get Root Sign <span style={{fontSize: '16px', fontWeight: 'normal'}}>{rootValue}</span></h2>
            <button type='button' onClick={() => handleGetRoot(1, false)}>Get Sign VIP1</button>
            <button type='button' onClick={() => handleGetRoot(2, false)}>Get Sign VIP2</button>
            <button type='button' onClick={() => handleGetRoot(3, false)}>Get Sign VIP3</button>
            <button type='button' onClick={() => handleGetRoot(4, false)}>Get Sign</button>
          </div>
          <div>
            <h2>Set Root Sign <span style={{fontSize: '16px', fontWeight: 'normal'}}>{rootValue}</span></h2>
            <button type='button' onClick={() => handleGetRoot(1, true)}>Set Sign VIP1</button>
            <button type='button' onClick={() => handleGetRoot(2, true)}>Set Sign VIP2</button>
            <button type='button' onClick={() => handleGetRoot(3, true)}>Set Sign VIP3</button>
            <button type='button' onClick={() => handleGetRoot(4, true)}>Set Sign</button>
          </div>
        </div>
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
