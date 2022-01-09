import { useEffect, useState, useCallback } from 'react'
import { BrainDance } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import api from 'utils/api'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import MintButton from 'components/MintButton'
import './Home.scoped.scss'
import MintModal from 'pages/MintModal'
import { headerToken } from 'utils/helper'
import {connectToMetamask, getAccountStatus, getContractStatus} from 'actions/contract'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [saleTimer, setSaleTimer] = useState(1000)
  const [openedMintModal, setOpenedMintModal] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)

  // const web3 = useSelector((state: any) => state.contract.web3)
  const contract = useSelector((state: any) => state.contract.contract)
  const price = useSelector((state: any) => state.contract.price)
  const statusFlag = useSelector((state: any) => state.contract.statusFlag)
  const mintedInitialTokenCount = useSelector((state: any) => state.contract.mintedInitialTokenCount)
  const stepBalance = useSelector((state: any) => state.contract.stepBalance)
  const balance = useSelector((state: any) => state.contract.balance)
  const countLimit = useSelector((state: any) => state.contract.countLimit)
  const INITIAL_TOKEN_COUNT = useSelector((state: any) => state.contract.INITIAL_TOKEN_COUNT)
  const dispatch = useDispatch() as any

  const titleArr = [
    'Not started',
    'Gold VIP',
    'Silver vIP',
    'Bronze VIP',
    'Public Sale',
    'Ended',
    'Paused',
  ]

  const onTimer = useCallback(async () => {
    dispatch(getContractStatus(contract))
    dispatch(getAccountStatus(contract, wnd.ethereum.selectedAddress))
  }, [dispatch, contract])

  const onTimerSecond = useCallback(() => {
    setSaleTimer(saleTimer <= 0 ? 0 : saleTimer - 1)
  }, [saleTimer])

  useEffect(() => {
    dispatch(connectToMetamask()).then((res: any) => {
      dispatch(getContractStatus(res.contract))
      dispatch(getAccountStatus(res.contract, wnd.ethereum.selectedAddress))
      
    }, (err: any) => {})
  }, [dispatch])

  useEffect(() => {
    onTimer()
    const counter = setInterval(onTimer, 10000)
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
    ;(async () => {
      const res = await await api.get('/get-starttime');
      setStartTime(Number(res.data.starttime));
      const {data} = await api.get('/get-time')
      const currentTime = data.time;
      
      const periods = [0, 48, 48, 48, 48]
      setSaleTimer(Number(res.data.starttime) - currentTime + periods[statusFlag] * 3600)
    })()
  }, [statusFlag])
  
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

    if (statusFlag === 0) {
      NotificationManager.warning('Mint sale is not started', 'Not started')
      return
    }

    if (statusFlag === 5) {
      NotificationManager.warning('Mint sale has been ended', 'Mint sale been ended')
      return
    }

    if (statusFlag === 6) {
      NotificationManager.warning('Mint sale has been paused', 'Mint sale been ended')
      return
    }

    if (mintAmount === 0) {
      NotificationManager.warning('Please select mint amount', 'Select mint amount')
      return
    }

    if (!mintEnabled(mintAmount)) {
      NotificationManager.warning('Please select correct mint amount', 'Amount error')
      return
    }

    setLoading(true)
    try {
      const contractBD = new BrainDance(contract)

      if (statusFlag !== 4) {
        const addr = window.ethereum.selectedAddress
        const { data } = await api.post('/mint-whitelist', {
          address: addr,
          step: statusFlag,
        }, {
          headers: headerToken(addr)
        })
        if (!data.verified) {
          NotificationManager.error("You are not added to the whitelist", 'Error')
          setLoading(false)
          return
        }
        await contractBD.mintVip(account, price, mintAmount, data.proof)
      } else {
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

  const mintEnabled = (count: number) => {
    if (!(stepBalance + count <= countLimit && [1, 2, 3, 4].includes(statusFlag))) {
      return false;
    }
    return count <= INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
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
            {titleArr[statusFlag]}
          </div>
          {[1, 2, 3].includes(statusFlag) && saleTimer > 0 && startTime > 0 && (
            <div className='timer'>{getTimeString(saleTimer)}</div>
          )}
          <div className='info'>
            <div className='account-info'>
              <div className='item'>
                <label>Token:</label>
                <span>{balance}</span>
              </div>
            </div>
            <div className='contract-info'>
              <div className='item'>
                <label>Remaining:</label>
                <span>{INITIAL_TOKEN_COUNT - mintedInitialTokenCount - 1500 < 1500 ? INITIAL_TOKEN_COUNT - mintedInitialTokenCount : INITIAL_TOKEN_COUNT - mintedInitialTokenCount - 1500}</span>
              </div>
            </div>
            {countLimit > 1 && (
              <div className='amount-selector'>
                {[...Array(countLimit).keys()].map(v => (
                  <button
                    key={v + 1}
                    type='button'
                    onClick={() => setMintAmount(v + 1)}
                    className={v + 1 === mintAmount ? "selected" : ""}
                    disabled={!mintEnabled(v + 1)}
                  >
                    {v + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='mint-wrapper'>
            <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
              <MintButton onMint={() => setOpenedMintModal(true)} disabled={!(mintEnabled(1))} />
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
