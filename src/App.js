import './App.css';

import { HashRouter, Route, Routes } from 'react-router-dom';

import { Flowbite } from 'flowbite-react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Redirect from './pages/Redirect';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App({ contract, currentUser, wallet, nearConnection }) {
  const signIn = () => {
    wallet.requestSignIn({
      contractId: 'htahir.testnet',
      successUrl: window.location.origin + '/#/redirect',
    });
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <HashRouter>
      <Flowbite>
        <div className='min-h-screen dark:bg-gray-900 text-black dark:text-white font-bold'>
          <Navbar login={signIn} logout={signOut} acc={currentUser} />
          <Routes>
            <Route
              path='/'
              exact
              element={<Home login={signIn} acc={currentUser} nearConnection={nearConnection} />}
            />
            <Route path='/redirect' exact element={<Redirect />} />
          </Routes>
        </div>
      </Flowbite>
    </HashRouter>
  );
}

export default App;
