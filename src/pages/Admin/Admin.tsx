import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import api from 'utils/api'
import './Admin.scoped.scss'
import { headerToken } from 'utils/helper'
import { NotificationManager } from 'components/Notification'

const wnd = window as any

interface Props {}

const Admin = (props: Props) => {
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)

  const connectMetamask = async (e: any) => {
    const connectRes = await connectToWallet()
    console.log(connectRes)
    if (connectRes) {
      setWeb3(connectRes.web3)
      setContract(connectRes.contract)
      const account = wnd.ethereum.selectedAddress
      setMetamaskAccount(account)
    }
  }

  useEffect(() => {
    connectMetamask(null)
  }, [])

  const handleStartTime = async () => {
    setLoading(true)
    try {
      await api.post('/set-starttime', {
        address: metamaskAccount
      }, {
        headers: headerToken(metamaskAccount)
      })
      NotificationManager.success('Starttime was set successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('Starttime was not set successfully', 'Error')
    }
    setLoading(false)
  }

  const handlePause = async (pause: number) => {
    setLoading(true)
    try {
      const contractObj = new BrainDance(contract)
      await contractObj.setPause(metamaskAccount, pause !== 0)
      await api.post('/set-pause', {
        pause,
        address: metamaskAccount
      }, {
        headers: headerToken(metamaskAccount)
      })
      NotificationManager.success('bPaused was set successfully', 'Success')
    } catch (ex) {
      console.log(ex)
      NotificationManager.error('bPaused was not set successfully', 'Error')
    }
    setLoading(false)
  }

  return (
    <div className='home-page'>
      {contractConfig.deployer.toLocaleLowerCase() === metamaskAccount.toLocaleLowerCase() && (
        <>
          <div>
            <button type='button' onClick={handleStartTime}>Set StartTime</button>
          </div>
          <div>
            <button type='button' onClick={() => handlePause(1)}>Set Pause</button>
            <button type='button' onClick={() => handlePause(0)}>Clear Pause</button>
            <button type='button' onClick={() => handlePause(-1)}>Set as not started</button>
          </div>
        </>
      )}
      {loading && <Loader />}
    </div>
  )
}

export default Admin
