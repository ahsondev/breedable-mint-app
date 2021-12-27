import { useEffect, useState, useCallback } from 'react'
import { BrainDance, connectToWallet } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import api from 'utils/api'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import './Home.scoped.scss'
import MintModal from 'pages/MintModal'
import { headerToken, decrypt } from 'utils/helper'
import {connectToMetamask, getAccountStatus, getContractStatus} from 'actions/contract'
import { useDispatch, useSelector } from 'react-redux'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState((new Date()).getTime())
  const [openedMintModal, setOpenedMintModal] = useState(false)

  const web3 = useSelector((state: any) => state.contract.web3)
  const contract = useSelector((state: any) => state.contract.contract)
  const price = useSelector((state: any) => state.contract.price)
  const statusFlag = useSelector((state: any) => state.contract.statusFlag)
  const mintedInitialTokenCount = useSelector((state: any) => state.contract.mintedInitialTokenCount)
  const tokenCount = useSelector((state: any) => state.contract.tokenCount)
  const ticketTokenCount = useSelector((state: any) => state.contract.ticketTokenCount)
  const ticketCount = useSelector((state: any) => state.contract.ticketCount)
  const dispatch = useDispatch() as any

  const onTimer = useCallback(async () => {
    dispatch(getContractStatus(contract))
    dispatch(getAccountStatus(contract, wnd.ethereum.selectedAddress))
  }, [contract])

  const onTimerSecond = useCallback(() => {
    const now = new Date()
    setCurrentTime(now.getTime())
  }, [])

  useEffect(() => {
    dispatch(connectToMetamask()).then((res: any) => {
      dispatch(getContractStatus(res.contract))
      dispatch(getAccountStatus(res.contract, wnd.ethereum.selectedAddress))
      api.get('/get-starttime').then((res: any) => {
        setStartTime(Number(res.data.starttime))
      }, (err: any) => {})
    }, (err: any) => {})
  }, [])

  useEffect(() => {
    const counter = setInterval(onTimer, 4000)
    return (() => {
      clearInterval(counter)
    })
  }, [onTimer])

  useEffect(() => {
    const counter = setInterval(onTimerSecond, 1000)
    return (() => {
      clearInterval(counter)
    })
  }, [onTimerSecond])

  useEffect(() => {
  }, [])
  
  const handleMint = async () => {
    setOpenedMintModal(false)

    const account = wnd.ethereum.selectedAddress

    if (!account) {
      NotificationManager.warning('You are not connected to wallet', 'Not connected')
      return
    }

    if (Number(window.ethereum.networkVersion) !== 4) {
      NotificationManager.warning('Please connect to the mainnet', 'Network error')
      return
    }

    if (statusFlag < 2) {
      NotificationManager.warning('Mint sale is not started', 'Not started')
      return
    }

    if (statusFlag === 4) {
      NotificationManager.warning('Mint sale has ended', 'Mint sale ended')
      return
    }

    if (!mintEnabled()) {
      NotificationManager.warning('Mint sale has ended', 'Mint sale ended')
      return
    }

    setLoading(true)
    try {
      const contractBD = new BrainDance(contract)
      await contractBD.mint(account, price)
      NotificationManager.info('Successfully minted', 'Success')
    } catch (e) {
      console.log(e)
      NotificationManager.error('Mint operation was not done successfully', 'Error')
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

  const mintEnabled = () => {
    if (statusFlag === 2) {
      return (ticketTokenCount + 1 <= ticketCount)
    }
    if (statusFlag === 3) {
      return (tokenCount + 1 <= 3)
    }
    return false
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
          <div className='title'>
            {statusFlag < 2 && <>Not started</>}
            {statusFlag === 2 && <>Presale</>}
            {statusFlag === 3 && <>Public sale</>}
            {statusFlag === 4 && <>Mint ended</>}
            {statusFlag === 5 && <>Mint paused</>}
          </div>
          {statusFlag === 2 && remainSeconds() > 0 && startTime > 0 && (
            <div className='timer'>{getTimeString(remainSeconds())}</div>
          )}
          <div className='info'>
            <div className='account-info'>
              <div className='item'>
                <label>Ticket:</label>
                <span>{ticketCount}</span>
              </div>
              <div className='item'>
                <label>Token:</label>
                <span>{tokenCount}</span>
              </div>
            </div>
            <div className='contract-info'>
              <div className='item'>
                <label>Remaining:</label>
                <span>{10101 - mintedInitialTokenCount - 1500 < 1500 ? 10101 - mintedInitialTokenCount : 10101 - mintedInitialTokenCount - 1500}</span>
              </div>
            </div>
          </div>

          <div className='mint-wrapper'>
            <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
              <MintButton onMint={() => setOpenedMintModal(true)} disabled={!mintEnabled()} />
            </GoogleReCaptchaProvider>
          </div>
        </div>
      </div>
      
      {loading && <Loader />}
      <MintModal isOpen={openedMintModal} onMint={handleMint} onRequestClose={() => setOpenedMintModal(false)}/>
    </div>
  )
}

export default Home
