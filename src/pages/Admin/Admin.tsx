import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import api from 'utils/api'
import './Admin.scoped.scss'

const wnd = window as any

interface Props {}

const Admin = (props: Props) => {
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<BrainDance>(new BrainDance())

  const connectMetamask = async (e: any) => {
    const connectRes = await connectToWallet()
    console.log(connectRes)
    if (connectRes) {
      setWeb3(connectRes.web3)
      setContract(connectRes.contract)
      const account = wnd.ethereum.selectedAddress
      setMetamaskAccount(account)
      console.log("Connected ...")
      console.log("Connected Address: ", account)
    }
  }

  useEffect(() => {
    connectMetamask(null)
  }, [])

  const handleWithdraw = () => {
    setLoading(true)
    try {
      contract.withdrawEth(metamaskAccount).on('transactionHash', function(hash: any) {
        setLoading(false)
      })
      .on('receipt', function(receipt: any) {
        console.log("receipt", receipt)
        setLoading(false)
      })
      .on('confirmation', function(confirmationNumber: any, receipt: any) {
        setLoading(false)
      })
      .on('error', (err: any) => {
        setLoading(false)
        console.error(err)
      }); // If a out of gas error, the second parameter is the receipt.
    } catch (ex) {
      setLoading(false)
      console.log(ex)
    }
  }

  const handleStartTime = () => {
    setLoading(true)
    try {
      contract.setStarttime(metamaskAccount).then((res1: any) => {
        contract.nativeContract.methods.startTime().call().then((res: any) => {
          api.post('/set-starttime', {starttime: res}).then(res2 => {
            NotificationManager.success('Starttime set')
          }, err2 => {}).finally(() => {
            setLoading(false)
          })
        }, (err: any) => {
          console.log(err)
        })
      }, (err: any) => {}).finally(() => {
        setLoading(false)
      })
    } catch (ex) {
      setLoading(false)
      console.log(ex)
    }
  }

  return (
    <div className='home-page'>
      {contractConfig.deployer.toLocaleLowerCase() === metamaskAccount.toLocaleLowerCase() && (
        <>
          <div>
            <button type='button' onClick={handleStartTime}>Set StartTime</button>
          </div>
          <div style={{margin: '20px 0 0 0'}}>
            <button type='button' onClick={handleWithdraw}>Withdraw</button>
          </div>
        </>
      )}
      {loading && <Loader />}
    </div>
  )
}

export default Admin
