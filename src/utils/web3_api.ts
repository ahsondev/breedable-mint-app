import contractConfig from 'contracts/config.json'
import BrainDanceNft from 'contracts/BrainDanceNft.json'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Web3 from 'web3'
import config from './config'

const wnd = window as any

let web3: any

export class BrainDance {
  nativeContract: any = null

  mintNFT(addr: string, mintPricePerToken: number) {
    // const priceWei = web3.utils.toWei(mintPricePerToken.toString(), 'ether') // Convert to wei value
    // console.log('mintPricePerToken: ', mintPricePerToken, priceWei)
    // this.nativeContract.methods.requestRandomNFT(addr, amount).send({
    //   from: addr,
    //   value: priceWei,
    // }).then((res: any) => {
    //   resolve(res)
    // }, (err: any) => {
    //   reject(err)
    // })

    // real gas = gas * maxPriorityFeePerGas / 10^18
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      // gas: 50000, // 500 000 gas
      value: mintPricePerToken,
      // maxPriorityFeePerGas: 1999999987, // 199...987 wei
      data: this.nativeContract.methods.mint().encodeABI(),
    }

    return web3.eth.sendTransaction(tx)
  }

  breedNFT(addr: string, heroId1: number, heroId2: number, tokenUri: string) {
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.mintBreedToken(tokenUri, heroId1, heroId2).encodeABI(),
    }

    return web3.eth.sendTransaction(tx)
  }

  withdrawEth(address: string) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.withdrawAll().encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }

  setPause(address: string, value: boolean) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.setPause(value).encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }

  addWhiteList(address: string, _addresses: string[]) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.addWhiteLists(_addresses).encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }

  removeWhiteList(address: string, _addresses: string[]) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.removeWhiteLists(_addresses).encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }

  setStarttime(address: string) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.setStarttime().encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }

  mintUnsoldTokens(address: string, tokenUris: string[]) {
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.mintUnsoldTokens(address, tokenUris).encodeABI(),
    }
    return web3.eth.sendTransaction(tx)
  }
}

let contract: BrainDance

export const connectToWallet = async () => {
  try {
    if (wnd.ethereum) {
      await wnd.ethereum.request({ method: 'eth_requestAccounts' });
      await wnd.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.networks[config.network].chainId }],
        })

      web3 = createAlchemyWeb3(config.networks[config.network].alchemyWssUrl)
      // web3 = new Web3('wss://eth-kovan.alchemyapi.io/v2/IROGTMfjIr-d3od_IUeYNDzpSVbMHQZY')
      console.log(BrainDanceNft, contractConfig.contractAddress)
      contract = new BrainDance()
      contract.nativeContract = new web3.eth.Contract(
        BrainDanceNft,
        contractConfig.contractAddress
      )
      return {
        web3,
        contract,
      }
    }
  } catch (switchError) {
    console.log(switchError)
  }

  return null
}

export const getEthBalance = (addr: string) =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    web3.eth.getBalance(addr).then(
      (_balance: any) => {
        const balance = web3.utils.fromWei(_balance, 'ether')
        resolve(balance)
      },
      (err: any) => {}
    )
  })
