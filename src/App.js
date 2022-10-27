import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { HashRouter, Route, Routes } from 'react-router-dom';

import { Flowbite } from 'flowbite-react';
import Footer from './components/Footer';
import Home from './pages/Home';
import { KeyPairEd25519 } from 'near-api-js/lib/utils/key_pair';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Recover from './pages/Recover';
import Redirect from './pages/Redirect';
import { ToastContainer } from 'react-toastify';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App({ contract, currentUser, wallet, nearConnection }) {
  const signInFullAccess = () => {
    const myKeyPair = KeyPairEd25519.fromRandom();

    window.localStorage.setItem('myKeyPair', myKeyPair.toString());

    const link = `https://wallet.testnet.near.org/login/
      ?referrer=http://localhost:3000
      &success_url=${window.location.origin + '/%23%0A/redirect/'}
      &failure_url=${window.location.origin + '/%23%0A/redirect/'}
      &public_key=${myKeyPair.getPublicKey().toString()}`;

    window.location.href = link;
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <HashRouter>
      <Flowbite>
        <div className='app-bg dark:bg-none min-h-screen dark:bg-gray-900 text-black dark:text-white relative'>
          <Navbar logout={signOut} acc={currentUser} />
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route
              path='/profile'
              exact
              element={
                <Profile
                  wallet={wallet}
                  loginFull={signInFullAccess}
                  acc={currentUser}
                  nearConnection={nearConnection}
                />
              }
            />
            <Route
              path='/recover'
              exact
              element={
                <Recover
                  acc={currentUser}
                  wallet={wallet}
                  nearConnection={nearConnection}
                />
              }
            />
            <Route
              path='/redirect'
              exact
              element={<Redirect acc={currentUser} wallet={wallet} />}
            />
          </Routes>
          <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Footer />
        </div>
      </Flowbite>
    </HashRouter>
  );
}

export default App;
