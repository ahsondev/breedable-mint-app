import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import api from 'utils/api'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import './Home.scoped.scss'
import MintModal from 'pages/MintModal'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<BrainDance>(new BrainDance())
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [paused, setPaused] = useState(true)
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState((new Date()).getTime())
  const [remainTokenCount, setRemainTokenCount] = useState(-1)
  const [openedMintModal, setOpenedMintModal] = useState(false)

  const connectMetamask = async () => {
    const connectRes = await connectToWallet()
    console.log(connectRes)
    const obj = {
      contract: null as any,
      web3: null as any,
      price: 0,
      isWhiteList: false,
      paused: true,
      remainTokenCount: 0,
      metamaskAccount: ''
    }

    if (connectRes) {
      setWeb3(connectRes.web3)
      setContract(connectRes.contract)
      const account = wnd.ethereum.selectedAddress
      setMetamaskAccount(account)

      obj.contract = connectRes.contract
      obj.web3 = connectRes.web3
      obj.metamaskAccount = account

      let res = await connectRes.contract.nativeContract.methods.MINT_PRICE().call()
      setPrice(res)
      obj.price = res

      res = await api.get(`/whitelist?address=${account}`)
      setIsWhiteList(res.data.whitelist)
      obj.isWhiteList = res.data.whitelist

      res = await connectRes.contract.nativeContract.methods.bPaused().call()
      setPaused(res as boolean)
      obj.paused = res as boolean

      res = await connectRes.contract.nativeContract.methods.remainTokenCount().call()
      setRemainTokenCount(res)
      obj.remainTokenCount = res

      console.log("Connected ...")
      console.log("Connected Address: ", account)
    }
    return obj
  }

  useEffect(() => {
    // ;(async () => {
    //   const { oauth_token, oauth_verifier, code } = queryString.parse(window.location.search)
    //   if (code) {
    //     // Discord oAuth 2.0
    //     try {
    //       const {data: profile} = await api.post('/auth/discord/profile', {code})
    //       setLoggedIn(true)
    //       setUsername(profile.username)
    //       await connectMetamask()
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   } else if (oauth_token && oauth_verifier) {
    //     // Twitter oAuth 1.0
    //     try {
    //       // Oauth Step 3
    //       // Authenticated Resource Access
    //       const {data: profile} = await api.post('/auth/twitter/profile', {
    //         oauth_token: getStorageItem('oauth_token', ''),
    //         oauth_verifier
    //       })

    //       setLoggedIn(true)
    //       setUsername(profile.name)
    //       await connectMetamask()
    //       console.log(profile)
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   } else {
    //     // check if user is included in whitelist
    //   }
    // })()

    api.post('/get-starttime').then((res: any) => {
      setStartTime(Number(res.data.starttime))
    }, (err: any) => {})

    // connectMetamask()

    const counter = setInterval(onTimer, 1000)
    return () => {
      clearInterval(counter);
    }
  }, [])

  const onTimer = () => {
    const now = new Date()
    setCurrentTime(now.getTime())
  }

  const handleMint = async () => {
    setOpenedMintModal(false)
    const obj = await connectMetamask()
    console.log(obj)
    if (!obj.metamaskAccount) {
      NotificationManager.warning('You are not connected to wallet', 'Not connected')
      return
    }
    if (obj.paused) {
      NotificationManager.warning('Minting was paused by owner', 'Paused')
      return
    }

    const presaleTimer = remainSeconds()
    if (presaleTimer > 0 && !obj.isWhiteList) {
      NotificationManager.warning('You are not added to whitelist', 'Not allowed')
      return
    }
    // if (presaleTimer <= 0 && !loggedIn) {
    //   NotificationManager.warning('You are not authenticated', 'Not authenticated')
    //   return
    // }

    setLoading(true)
    const apiUrl = presaleTimer <= 0 ? '/mint' : '/mint-whitelist'
    api.post(apiUrl, { address: obj.metamaskAccount }).then(res => {
      const { proof, verified, address } = res.data
      if (!verified) {
        NotificationManager.error('You are not verified', 'Verify Error')
      }

      try {
        obj.contract.mintNFT(obj.metamaskAccount, obj.price, proof, address).then((res1: any) => {
          console.log(res1)
          NotificationManager.info('Successfully minted', 'Success')
        }, (err: any) => {
          console.log(err)
          NotificationManager.error('Failed to mint because of contract exception', 'Failed')
        }).finally(() => {
          setLoading(false)
        })
      } catch (err) {
        console.log(err)
        NotificationManager.error('Failed to mint because of wallet exception', 'Failed')
        setLoading(false)
      }
    }, err => {
      console.log(err)
      NotificationManager.error('Please check if you are online', 'Server Error')
      setLoading(false)
    }).catch(err => {
      console.log(err)
      NotificationManager.error('Please check if you are online', 'Server Error')
      setLoading(false)
    })
  }

  const getTimeString = (tSecs: number) => {
    const h = Math.floor(tSecs / 3600)
    const m = Math.floor((tSecs % 3600) / 60)
    const s = Math.floor(tSecs % 60)
    return h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
  }

  const remainSeconds = () => {
    return Math.round(startTime - currentTime / 1000) + 24 * 3600
  }

  return (
    <div className='home-page'>
      <div className='container'>
        <div className='characters'>
          <div className='animation-wrapper'>
            <iframe src="/Boy LifeTank.33/Boy Life Tank.33.html"
              allowFullScreen={true}
              frameBorder="0"
              scrolling="no"
              title="BodyLife"
            />
          </div>
          <div className='animation-wrapper'>
            <iframe src="Girl Life Tank.34/Boy Life Tank.34.html"
              allowFullScreen={true}
              frameBorder="0"
              scrolling="no"
              title="GirlLife"
            />
          </div>
        </div>
        <div className='button-wrapper'>
          {remainSeconds() > 0 && startTime > 0 && (
            <div className="presale-container">
              <div className='title'>Presale</div>
              <div className='timer'>{getTimeString(remainSeconds())}</div>
            </div>
          )}

          {remainSeconds() <= 0 && (
            <div className="publicsale-container">
              <div className='title'>{remainTokenCount === 0 ? "Sold out" : "Public Sale"}</div>
            </div>
          )}
          
          <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
            <MintButton onMint={() => setOpenedMintModal(true)} />
          </GoogleReCaptchaProvider>
        </div>
      </div>
      
      {loading && <Loader />}
      {/* <AuthSelectorModal
        isOpen={remainSeconds() < 0 && !loggedIn}
        onTwitter={onTwitterLogin}
        onDiscord={onDiscordLogin}
      /> */}
      <MintModal isOpen={openedMintModal} onMint={handleMint} onRequestClose={() => setOpenedMintModal(false)}/>
    </div>
  )
}

export default Home
