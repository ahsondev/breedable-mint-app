import contractConfig from 'contracts/config.json'
import BrainDanceNft from 'contracts/BrainDanceNft.json'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
// import Onboard from 'bnc-onboard'

let web3: any

// const onboard = Onboard({
//   dappId: 'e31c177f-44ee-4dec-b21b-f6cdf362f531',       // [String] The API key created by step one above
//   networkId: 4,  // [Integer] The Ethereum network ID your Dapp uses.
//   subscriptions: {
//     wallet: (wallet: any) => {
//        web3 = new Web3(wallet.provider)
//     }
//   },
//   walletSelect: {
//     wallets: [
//       { walletName: "metamask", preferred: true }
//     ] 
//   }
// });

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    }
  }
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: false, // optional
  providerOptions // required
});


export class BrainDance {
  nativeContract: any = null
  gasConfig: any = {
    gas: 300000,
    maxPriorityFeePerGas: 1000000000, // 199...987 wei
  }

  constructor(contract: any) {
    this.nativeContract = contract
  }

  mintVIP(addr: string, mintPricePerToken: number, count: number, proof: any) {
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      value: mintPricePerToken * count,
      data: this.nativeContract.methods.mintVIP(proof, count).encodeABI(),
      ...this.gasConfig,
    }

    return web3.eth.sendTransaction(tx)
  }

  mint(addr: string, mintPricePerToken: number, count: number) {
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      value: mintPricePerToken * count,
      data: this.nativeContract.methods.mint(count).encodeABI(),
      ...this.gasConfig,
    }

    return web3.eth.sendTransaction(tx)
  }

  setStatusFlag(addr: string, statusFlag: number) {
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      data: this.nativeContract.methods.setStatusFlag(statusFlag).encodeABI(),
      ...this.gasConfig,
    }

    return web3.eth.sendTransaction(tx)
  }
}

export const connectToWallet = async () => {
  try {
    // await onboard.walletSelect();
    // await onboard.walletCheck();

    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    const contract = new web3.eth.Contract(BrainDanceNft, contractConfig.contractAddress)
    return { web3, contract }
  } catch (switchError) {
    console.log(switchError)
  }

  return null
}

export const getEthBalance = (addr: string) =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    web3.eth.getBalance(addr).then((_balance: any) => {
        const balance = web3.utils.fromWei(_balance, 'ether')
        resolve(balance)
      },
      (err: any) => {}
    )
  })
