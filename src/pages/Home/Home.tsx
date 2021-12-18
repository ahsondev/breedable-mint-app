import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import api from 'utils/api'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import './Home.scoped.scss'
import MintModal from 'pages/MintModal'
import { headerToken, decrypt } from 'utils/helper'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [contract, setContract] = useState<any>(null)
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
      paused: true,
      remainTokenCount: 0,
      metamaskAccount: ''
    }

    if (connectRes) {
      setContract(connectRes.contract)
      obj.contract = connectRes.contract
      obj.web3 = connectRes.web3
      obj.price = await connectRes.contract.methods.mintPrice().call()
      obj.metamaskAccount = wnd.ethereum.selectedAddress
      obj.paused = await connectRes.contract.methods.bPaused().call()
      obj.remainTokenCount = await connectRes.contract.methods.remainTokenCount().call()
      setPaused(obj.paused)
      setRemainTokenCount(obj.remainTokenCount)
    }

    return obj
  }

  useEffect(() => {
    api.post('/get-starttime').then((res: any) => {
      setStartTime(Number(res.data.starttime))
    }, (err: any) => {})

    // connectMetamask()

    const counter1 = setInterval(onTimer1, 1000)
    const counter2 = setInterval(onTimer2, 5000)
    return () => {
      clearInterval(counter1);
      clearInterval(counter2);
    }
  }, [])

  const onTimer1 = () => {
    const now = new Date()
    setCurrentTime(now.getTime())
  }
  
  const onTimer2 = async () => {
    if (contract) {
      const paused = await contract.methods.bPaused().call()
      setPaused(paused)
    }
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

    setLoading(true)
    try {
      const {data} = await api.post('/mint',
        { address: obj.metamaskAccount },
        { headers: headerToken(obj.metamaskAccount) })

        const sign = Number(decrypt(data.token))
        const contract = new BrainDance(obj.contract)
        await contract.mint(obj.metamaskAccount, obj.price, sign)
        NotificationManager.info('Successfully minted', 'Success')
    } catch (e) {
      console.log(e)
      NotificationManager.error('Please check if you are online', 'Server Error')
    }
    setLoading(false)
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
              <div className='title'>
                {paused && <>Paused</>}
                {!paused && (remainTokenCount === 0 ? <>Sold out</> : <>Public Sale</>)}
              </div>
            </div>
          )}
          
          <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
            <MintButton onMint={() => setOpenedMintModal(true)} />
          </GoogleReCaptchaProvider>
        </div>
      </div>
      
      {loading && <Loader />}
      <MintModal isOpen={openedMintModal} onMint={handleMint} onRequestClose={() => setOpenedMintModal(false)}/>
    </div>
  )
}

export default Home
