import './index.css';

import { Contract, WalletConnection, connect, keyStores } from 'near-api-js';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import environment from './NEAR/config';

// Initializing contract
async function initContract() {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  const nearConfig = environment('testnet');

  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  // Initializing connection to the NEAR testnet
  const near = await connect({ keyStore, ...nearConfig });

  // Initialize wallet connection
  const walletConnection = new WalletConnection(near);

  // Load in user's account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      // Gets the accountId as a string
      accountId: walletConnection.getAccountId(),
      // Gets the user's token balance
      balance: (await walletConnection.account().state()).amount,
    };
  }

  const contract = await new Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: [],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: [],
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, walletConnection, near };
}

window.nearInitPromise = initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection, near }) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
        nearConnection={near}
      />
    );
  }
);
