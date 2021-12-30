let env = {}

if (process.env.NODE_ENV === 'development') {
  env = {
    network: 'rinkeby',
    apiUrl: 'http://127.0.0.1:4000/api'
  }
} else {
  env = {
    network: 'mainnet',
    apiUrl: '/api'
  }
}

const config = {
  ...env,
  appID: 'BrainDance',
  networks: {
    mainnet: {
      chainId: '0x1',
      alchemyHttpUrl: process.env.REACT_APP_ALCHEMY_RINKEBY_HTTP_URL,
      alchemyWssUrl: process.env.REACT_APP_ALCHEMY_RINKEBY_WSS_URL
    },
    rinkeby: {
      chainId: '0x4',
      alchemyHttpUrl: process.env.REACT_APP_ALCHEMY_RINKEBY_HTTP_URL,
      alchemyWssUrl: process.env.REACT_APP_ALCHEMY_RINKEBY_WSS_URL
    },
    kovan: {
      chainId: '0x2A',
      alchemyHttpUrl: process.env.REACT_APP_ALCHEMY_KOVAN_HTTP_URL,
      alchemyWssUrl: process.env.REACT_APP_ALCHEMY_KOVAN_WSS_URL
    }
  },
  initialTokenCount: 10101,
} as any

export const actionTypes = {
  CONNECT_WALLET: 'CONNECT_WALLET',
  READ_STATUS: 'READ_STATUS',
  ACCOUNT_STATUS: 'ACCOUNT_STATUS'
}

export default config
