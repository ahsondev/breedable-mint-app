import dotenv from 'dotenv-flow';

let env = {};

if (process.env.NODE_ENV === 'development') {
  env = {
    network: 'rinkeby',
    apiUrl: 'http://127.0.0.1:4000/api',
  };
} else {
  env = {
    network: 'mainnet',
    apiUrl: '/api',
  };
}

const config = {
  ...env,
  appID: 'BrainDance',
} as any;

export const actionTypes = {
  CONNECT_WALLET: 'CONNECT_WALLET',
  READ_STATUS: 'READ_STATUS',
  ACCOUNT_STATUS: 'ACCOUNT_STATUS',
};

export default config;
