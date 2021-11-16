import { useEffect, useState } from 'react'
import {
  connectToWallet,
  getEthBalance,
} from 'utils/web3_api'
import contractConfig from 'contracts/config.json'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import api from 'utils/api'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  // const [metamaskAccount, setMetamaskAccount] = useState('')
  // const [price, setPrice] = useState(0)
  // const [soldCount, setSoldCount] = useState(0)
  // const [remainingCount, setRemainingCount] = useState(0)
  // const [contractBalance, setContractBalance] = useState(0)
  // const [web3, setWeb3] = useState<any>(null)
  // const [accountBalance, setAccountBalance] = useState(0)
  // const [loading, setLoading] = useState(false)
  // const [contract, setContract] = useState<any>(null)

  // const connectMetamask = async (e: any) => {
  //   const connectRes = await connectToWallet()
  //   if (connectRes) {
  //     setWeb3(connectRes.web3)
  //     setContract(connectRes.contract)
  //     const account = wnd.ethereum.selectedAddress
  //     setMetamaskAccount(account)

  //     getEthBalance(account).then(
  //       (res) => {
  //         setAccountBalance(res)
  //       },
  //       (err) => {}
  //     )
  //     getPrice().then(
  //       (res) => {
  //         setPrice(res)
  //       },
  //       (err) => {}
  //     )
  //     getRemainTokenCount().then(
  //       (res) => {
  //         setRemainingCount(res)
  //       },
  //       (err) => {}
  //     )
  //     getMintedTokenCount().then(
  //       (res) => {
  //         setSoldCount(res)
  //       },
  //       (err) => {}
  //     )
  //     getEthBalance(contractConfig.contractAddress).then(
  //       (res) => {
  //         setContractBalance(res)
  //       },
  //       (err) => {}
  //     )
  //   }
  // }

  // const setMint = () => {
  //   setLoading(true)
  //   mintNFT(metamaskAccount, price)
  //     .then(
  //       (res) => {
  //         console.log(res)
  //       },
  //       (err) => {
  //         console.log(err)
  //       }
  //     )
  //     .finally(() => setLoading(false))
  // }

  useEffect(() => {
    // connectMetamask(null)
  }, [])

  // useEffect(() => {
  //   // NotificationManager.success('Success message', 'Title here')
  //   if (contract) {
  //     contract.events.MintedNewNFT({}, (error: any, event: any) => {
  //       console.log('event: ', error, event)
  //       if (error) {
  //         return
  //       }
        
  //       const msg = `Token ${event.returnValues} minted. ${event.remainCount} token${event.remainCount <= 1 ? '' : 's'} are available`
  //       NotificationManager.info(msg, 'Minted new NFT')
  //     })
  //   }
  // }, [contract])

  const onChangeReCAPTCHA = () => {}

  const handleMint = () => {
    // api.post('/mint').then(res => console.log(res), err => console.log(err))
  }

  return (
    <div className='home-page'>

      {/* {loading && <Loader />} */}

      {/* <GoogleReCaptchaProvider reCaptchaKey="6Lf3JqwZAAAAAM7EVYnGEw3QtmXEI8gWxjr3rdGZ">
        <MintButton />
      </GoogleReCaptchaProvider> */}
      <button type='button' onClick={handleMint}>Mint</button>
    </div>
  )
}

export default Home
