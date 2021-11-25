import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet, getEthBalance } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import queryString from 'query-string'
import moment from 'moment'
import { encrypt, decrypt, getStorageItem } from 'utils/helper'
import api from 'utils/api'
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import './Admin.scoped.scss'
import AuthSelectorModal from 'pages/AuthSelectorModal'

const wnd = window as any

interface Props {}

const Admin = (props: Props) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<BrainDance>(new BrainDance())
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [presaleTimer, setPresaleTimer] = useState(0)
  const [paused, setPaused] = useState(true)
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [remainTokenCount, setRemainTokenCount] = useState(-1)


  const [contractBalance, setContractBalance] = useState(0)

  // Breeding
  const [heroId1, setHeroId1] = useState(0)
  const [heroId2, setHeroId2] = useState(0)

  const testAddress = '0xA5DBC34d69B745d5ee9494E6960a811613B9ae32'

  // hero
  const [hero, setHero] = useState<any>(null)

  const connectMetamask = async (e: any) => {
    const connectRes = await connectToWallet()
    console.log(connectRes)
    if (connectRes) {
      setWeb3(connectRes.web3)
      setContract(connectRes.contract)
      const account = wnd.ethereum.selectedAddress
      setMetamaskAccount(account)

      connectRes.contract.nativeContract.methods.MINT_PRICE().call().then((res: any) => setPrice(res), (err: any) => console.log(err))
      api.get(`/whitelist?address=${account}`).then((res: any) => setIsWhiteList(res.data.whitelist), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.bPaused().call().then((res: any) => setPaused(res as boolean), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.startTime().call().then((res: any) => setStartTime(Number(res)), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.getChildren(10101).call().then((res: any) => setHero(res), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.remainTokenCount().call().then((res: any) => setRemainTokenCount(res), (err: any) => console.log(err))
      // connectRes.contract.nativeContract.methods.getChildrenWithParent(10102, 10101).call().then((res: any) => setHero(res), (err: any) => console.log(err))
      getEthBalance(contractConfig.contractAddress).then((res: any) => setContractBalance(res), (err: any) => console.log(err))
      console.log("Connected ...")
      console.log("Connected Address: ", account)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { oauth_token, oauth_verifier, code } = queryString.parse(window.location.search)
      if (code) {
        // Discord oAuth 2.0
        try {
          const {data: profile} = await api.post('/auth/discord/profile', {code})
          setLoggedIn(true)
          setUsername(profile.username)
        } catch (error) {
          console.error(error)
        }
      } else if (oauth_token && oauth_verifier) {
        // Twitter oAuth 1.0
        try {
          // Oauth Step 3
          // Authenticated Resource Access
          const {data: profile} = await api.post('/auth/twitter/profile', {
            oauth_token: getStorageItem('oauth_token', ''),
            oauth_verifier
          })

          setLoggedIn(true)
          setUsername(profile.name)
          console.log(profile)
        } catch (error) {
          console.error(error)
        }
      } else {
        // check if user is included in whitelist
      }
    })()

    connectMetamask(null)
    const counter = setInterval(onTimer, 1000)

    return () => {
      // clearInterval(counter);
    }
  }, [])

  const onTimer = () => {
    const now = new Date()
    setCurrentTime(now.getTime())
    if (contract?.nativeContract) {
      contract.nativeContract.methods.isPresale().call().then((res: any) => setPresaleTimer(res), (err: any) => console.log(err))
    }
  }

  useEffect(() => {
    // NotificationManager.success('Success message', 'Title here')
    if (contract?.nativeContract) {
      contract.nativeContract.events.MintedNewNFT({}, (error: any, event: any) => {
        console.log('event: ', error, event)
        if (error) {
          return
        }
        
        // const msg = `Token #${event.returnValues.tokenId.padStart(5, "0")} minted`
        const msg = `Token minted`
        NotificationManager.info(msg, 'Minted new NFT')
        contract.nativeContract.methods.remainTokenCount().call().then((res: any) => setRemainTokenCount(res), (err: any) => console.log(err))
      })

      contract.nativeContract.events.BreededNewNFT({}, (error: any, event: any) => {
        console.log('event: ', error, event)
        if (error) {
          return
        }
        
        const msg = `Token #${event.returnValues.tokenId.padStart(5, "0")} minted`
        NotificationManager.info(msg, 'Breeded new NFT')
      })

      contract.nativeContract.events.PauseEvent({}, (error: any, event: any) => {
        console.log('event: ', error, event)
        if (error) {
          return
        }
        
        const pause = event.returnValues.pause
        const msg = pause ? "Paused minting" : "Resumed minting"
        NotificationManager.info(msg, 'Paused new NFT')
      })
    }
  }, [contract])


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
    </div>
  )
}

export default Admin
