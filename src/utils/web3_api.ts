import contractConfig from 'contracts/config.json'
import BrainDanceNft from 'contracts/BrainDanceNft.json'
import Web3 from 'web3'
import Onboard from 'bnc-onboard'

let web3: any

const onboard = Onboard({
  dappId: 'e31c177f-44ee-4dec-b21b-f6cdf362f531',       // [String] The API key created by step one above
  networkId: 4,  // [Integer] The Ethereum network ID your Dapp uses.
  subscriptions: {
    wallet: (wallet: any) => {
       web3 = new Web3(wallet.provider)
    }
  },
  walletSelect: {
    wallets: [
      { walletName: "metamask", preferred: true }
    ] 
  }
});


export class BrainDance {
  nativeContract: any = null

  mintNFT(addr: string, mintPricePerToken: number, proof: any, leaf: string) {
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      // gas: 50000, // 500 000 gas
      value: mintPricePerToken,
      // maxPriorityFeePerGas: 1999999987, // 199...987 wei
      data: this.nativeContract.methods.mint(proof, leaf).encodeABI(),
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
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet', // optional
    //   cacheProvider: true,
    //   providerOptions, // required
    //   theme: "dark"
    // })
    // const provider = await web3Modal.connect();
    // console.log(provider)
    // web3 = new Web3(provider)
    await onboard.walletSelect();
    await onboard.walletCheck();
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
