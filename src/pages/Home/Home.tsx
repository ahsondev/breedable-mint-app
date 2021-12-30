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
import axios from 'axios'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState((new Date()).getTime())
  const [saleTimer, setSaleTimer] = useState(1000)
  const [openedMintModal, setOpenedMintModal] = useState(false)
  const [mintAmount, setMintAmount] = useState(0)

  const web3 = useSelector((state: any) => state.contract.web3)
  const contract = useSelector((state: any) => state.contract.contract)
  const price = useSelector((state: any) => state.contract.price)
  const statusFlag = useSelector((state: any) => state.contract.statusFlag)
  const mintedInitialTokenCount = useSelector((state: any) => state.contract.mintedInitialTokenCount)
  const presaleReservedTokenCount = useSelector((state: any) => state.contract.presaleReservedTokenCount)
  const presaleTokenCount = useSelector((state: any) => state.contract.presaleTokenCount)
  const tokenCount = useSelector((state: any) => state.contract.tokenCount)
  const ticketCount = useSelector((state: any) => state.contract.ticketCount)
  const INITIAL_TOKEN_COUNT = useSelector((state: any) => state.contract.INITIAL_TOKEN_COUNT)
  const dispatch = useDispatch() as any

  const onTimer = useCallback(async () => {
    dispatch(getContractStatus(contract))
    dispatch(getAccountStatus(contract, wnd.ethereum.selectedAddress))
  }, [contract])

  const onTimerSecond = useCallback(() => {
    setSaleTimer(saleTimer <= 0 ? 0 : saleTimer - 1)
  }, [saleTimer])

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
    onTimer()
    const counter = setInterval(onTimer, 10000)
    return (() => {
      clearInterval(counter)
    })
  }, [onTimer])

  useEffect(() => {}, [])

  useEffect(() => {
    const counter = setInterval(onTimerSecond, 1000)
    return (() => {
      clearInterval(counter)
    })
  }, [onTimerSecond])

  useEffect(() => {
    ;(async () => {
      const {data} = await axios.get('http://worldtimeapi.org/api/timezone/gmt')
      const currentTime = Math.round((new Date(data.utc_datetime)).getTime() / 1000)
      setSaleTimer(startTime - currentTime + (statusFlag === 2 ? 4 : 24) * 3600)
    })()
  }, [startTime, statusFlag])
  
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

    if (statusFlag === 5) {
      NotificationManager.warning('Mint sale has ended', 'Mint sale ended')
      return
    }

    if (mintAmount === 0) {
      NotificationManager.warning('Please select mint amount', 'Select mint amount')
      return
    }

    if (!(tokenCount + mintAmount <= 3)) {
      NotificationManager.warning('Please select correct mint amount', 'Amount error')
      return
    }
    
    if (statusFlag === 3) {
      if (tokenCount + mintAmount > ticketCount) {
        const publicTokenAvailable = (INITIAL_TOKEN_COUNT - mintedInitialTokenCount) - (presaleReservedTokenCount - presaleTokenCount)
        if (tokenCount + mintAmount - ticketCount > publicTokenAvailable) {
          NotificationManager.warning('Please select correct mint amount', 'Amount error')
          return
        }
      }
    }

    if (mintAmount > INITIAL_TOKEN_COUNT - mintedInitialTokenCount) {
      NotificationManager.warning('Please select correct mint amount', 'Amount error')
      return
    }

    if (!mintEnabled()) {
      NotificationManager.warning('Mint sale has ended', 'Mint sale ended')
      return
    }

    setLoading(true)
    try {
      const contractBD = new BrainDance(contract)

      if (statusFlag === 2) {
        const addr = window.ethereum.selectedAddress
        const { data } = await api.post('/get-whitelist', {
          address: addr
        }, {
          headers: headerToken(addr)
        })
        const sign = decrypt(data.token)
        await contractBD.mintWhitelist(account, price, mintAmount, sign)
      } else if (statusFlag === 3 || statusFlag === 4) {
        await contractBD.mint(account, price, mintAmount)
      }
      
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

  const mintEnabled = () => {
    if (!(tokenCount + 1 <= 3 && [2, 3, 4].includes(statusFlag))) {
      return false;
    }
    
    if (statusFlag === 3) {
      if (tokenCount + 1 > ticketCount) {
        const publicTokenAvailable = (INITIAL_TOKEN_COUNT - mintedInitialTokenCount) - (presaleReservedTokenCount - presaleTokenCount)
        return tokenCount + 1 - ticketCount <= publicTokenAvailable;
      }

      return true;
    }

    return 1 <= INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
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
            {(statusFlag === 3 || statusFlag === 4) && <>Public sale</>}
            {statusFlag === 5 && <>Mint ended</>}
            {statusFlag === 6 && <>Mint paused</>}
          </div>
          {(statusFlag === 2 || statusFlag === 3) && saleTimer > 0 && startTime > 0 && (
            <div className='timer'>{getTimeString(saleTimer)}</div>
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
                <span>{INITIAL_TOKEN_COUNT - mintedInitialTokenCount - 1500 < 1500 ? INITIAL_TOKEN_COUNT - mintedInitialTokenCount : INITIAL_TOKEN_COUNT - mintedInitialTokenCount - 1500}</span>
              </div>
            </div>
            {mintEnabled() && (
              <div className='amount-selector'>
                {[1, 2, 3].map(v => (
                  <button
                    key={v}
                    type='button'
                    onClick={() => setMintAmount(v)}
                    className={v === mintAmount ? "selected" : ""}
                    disabled={v + tokenCount > 3}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='mint-wrapper'>
            <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
              <MintButton onMint={() => setOpenedMintModal(true)} disabled={!(mintEnabled() && mintAmount > 0)} />
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
