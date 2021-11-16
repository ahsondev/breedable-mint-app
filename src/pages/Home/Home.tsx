import { useEffect, useState } from 'react'
import { BrainDance, connectToWallet, getEthBalance } from 'utils/web3_api'
import { NotificationManager } from 'components/Notification'
import Loader from 'components/Loader'
import contractConfig from 'contracts/config.json'
import moment from 'moment'

const wnd = window as any

interface Props {}

const Home = (props: Props) => {
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<BrainDance>(new BrainDance())
  const [contractBalance, setContractBalance] = useState(0)

  // Breeding
  const [heroId1, setHeroId1] = useState(0)
  const [heroId2, setHeroId2] = useState(0)

  const testAddress = '0xA5DBC34d69B745d5ee9494E6960a811613B9ae32'
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [paused, setPaused] = useState(false)
  const [startTime, setStartTime] = useState(0)

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
      connectRes.contract.nativeContract.methods.isWhiteList(testAddress).call().then((res: any) => setIsWhiteList(res), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.bPaused().call().then((res: any) => setPaused(res as boolean), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.startTime().call().then((res: any) => setStartTime(Number(res)), (err: any) => console.log(err))
      connectRes.contract.nativeContract.methods.getChildren(10101).call().then((res: any) => setHero(res), (err: any) => console.log(err))
      // connectRes.contract.nativeContract.methods.getChildrenWithParent(10102, 10101).call().then((res: any) => setHero(res), (err: any) => console.log(err))
      getEthBalance(contractConfig.contractAddress).then((res: any) => setContractBalance(res), (err: any) => console.log(err))
      console.log("Connected ...")
      console.log("Connected Address: ", account)
    }
  }

  useEffect(() => {
    connectMetamask(null)
  }, [])

  useEffect(() => {
    // NotificationManager.success('Success message', 'Title here')
    if (contract?.nativeContract) {
      contract.nativeContract.events.MintedNewNFT({}, (error: any, event: any) => {
        console.log('event: ', error, event)
        if (error) {
          return
        }
        
        const msg = `Token #${event.returnValues.tokenId.padStart(5, "0")} minted`
        NotificationManager.info(msg, 'Minted new NFT')
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


  const handleMint = () => {
    setLoading(true)
    try {
      contract.mintNFT(metamaskAccount, price).on('transactionHash', function(hash: any) {
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

  const handleBreed = () => {
    setLoading(true)
    try {
      const tokenUri = ""
      contract.breedNFT(metamaskAccount, heroId1, heroId2, tokenUri).on('transactionHash', function(hash: any) {
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

  const handleSetPause = (bAdd: boolean) => {
    setLoading(true)
    try {
      contract.setPause(metamaskAccount, bAdd).on('transactionHash', function(hash: any) {
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

  const handleAddWhiteList = (bAdd: boolean) => {
    setLoading(true)
    try {
      contract.addWhiteList(metamaskAccount, [testAddress]).on('transactionHash', function(hash: any) {
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
      contract.setStarttime(metamaskAccount).on('transactionHash', function(hash: any) {
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

  const handleMintUnsold = () => {
    setLoading(true)
    try {
      contract.mintUnsoldTokens(metamaskAccount, []).on('transactionHash', function(hash: any) {
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

  return (
    <div className='home-page'>
      {loading && <Loader />}
      <div>
        <button type='button' onClick={handleMint}>Mint</button>
      </div>
      <div>
        <span>heroId1</span>
        <input type="text" value={heroId1} onChange={(e: any) => setHeroId1(Number(e.target.value))} />
        <span>heroId2</span>
        <input type="text" value={heroId2} onChange={(e: any) => setHeroId2(Number(e.target.value))} />
        <button type='button' onClick={handleBreed}>Breed</button>
      </div>
      <div>
        <button type='button' onClick={handleWithdraw}>Winthdraw</button>
      </div>
      <div>Price: {price}</div>
      <div>contractBalance: {contractBalance}</div>
      <div>
        <button type='button' onClick={e => handleSetPause(true)}>setPause</button>
        <button type='button' onClick={e => handleSetPause(false)}>removePause</button>
      </div>
      <div>pause: {String(paused)}</div>
      <div>
        <button type='button' onClick={handleStartTime}>setStartTime</button>
      </div>
      <div>startTime: {moment(new Date(startTime * 1000)).format("YYYY-MM-DD HH:mm:ss")}</div>
      <div>
        <button type='button' onClick={e => handleAddWhiteList(true)}>addWhiteList</button>
        <button type='button' onClick={e => handleAddWhiteList(false)}>removeWhiteList</button>
      </div>
      <div>IsWhiteList: {String(isWhiteList)}</div>
      <div>hero: {JSON.stringify(hero)}</div>
      <div>
        <button type='button' onClick={handleMintUnsold}>mint unsold</button>
      </div>
    </div>
  )
}

export default Home
