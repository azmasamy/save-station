import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';
import { useState } from 'react';

const Recover = ({ wallet, acc, nearConnection }) => {
  const [accountID, setAccountID] = useState('');
  const [btnTxt, setBtnTxt] = useState('Recover Account');
  const [checkTxt, setCheckTxt] = useState('Login to Account');

  const login = async () => {
    // TODO check if account exists first
    await nearConnection.account(accountID).then((account) => {
      console.log(account);
      account
        .state()
        .then(() => {
          wallet.requestSignIn({
            contractId: accountID,
            successUrl: window.location.origin + '/#/redirect',
          });
        })
        .catch((err) => {
          toast.error('Account does not exist');
        });
    });
  };

  // const checkAccount = async () => {
  //   setCheckTxt('Checking...');
  //   const response = await nearConnection.connection.provider.query({
  //     request_type: 'view_account',
  //     finality: 'final',
  //     account_id: acc?.accountId,
  //   });

  //   if (response.code_hash === '11111111111111111111111111111111') {
  //     // setDeployedState('empty');
  //   } else if (
  //     response.code_hash === 'EZSuShZDU3Vbzanwt17xdfqRoWdJnqzZpkAYNN8AqhN7'
  //   ) {
  //     // setDeployedState('ours');
  //     // setFlowState('deployed');
  //   } else {
  //     // setDeployedState('other');
  //   }
  // };

  const recoverAccount = async () => {
    setBtnTxt('Recovering...');

    // TODO: add another redirect page

    // Generate key-pair
    // send the public one to the contract function
    // if it didn't panic, return the recovery link
    // recoveryLink: https://wallet.testnet.near.org/auto-import-secret-key#YOUR_ACCOUNT_ID/YOUR_PRIVATE_KEY
    // add a warning to the user that they should not share the link with anyone
    // maybe add a redirect button to recover the account

    const nearAccount = await nearConnection.account();
    nearAccount.accountId = acc.accountId;

    nearAccount
      .signAndSendTransaction({
        receiverId: acc.accountId,
        actions: [
          transactions.functionCall(
            'recoverAccount',
            {
              publicKey: 'string',
            },
            30000000000000,
            0
          ),
        ],
      })
      .then((res) => {
        toast.success(`Account Recovered successfully`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setBtnTxt('Recovered');
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error updating data`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setBtnTxt('Recovered');
      });
  };

  return (
    <main className='max-w-screen-lg px-4 py-8 md:py-28 mx-auto relative'>
      <h2 className='mb-10 text-4xl font-bold text-center'>How it works</h2>
      <ol className='items-center md:flex'>
        <li className='relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
          <div className='flex items-center'>
            <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-300 rounded-full ring-0 ring-white dark:bg-primary-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
              1
            </div>
            <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
          </div>
          <div className='mt-3 sm:pr-8'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Login to Account{' '}
              {/* <span>{flowState !== 'begin' ? '✅' : '⏳'}</span> */}
            </h3>
            <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptate, et!
            </p>
          </div>
        </li>
        <li className='relative mb-6 sm:mb-0  flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
          <div className='flex items-center mt-3 md:mt-0'>
            <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-300 rounded-full ring-0 ring-white dark:bg-primary-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
              2
            </div>
            <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
          </div>
          <div className='mt-3 sm:pr-8'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Request Recovery{' '}
              <span>
                {/* {(flowState === 'deployed' && deployedState === 'ours') ||
                flowState === 'deployed'
                  ? '✅'
                  : '⏳'} */}
              </span>
            </h3>
            <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
              ullam.
            </p>
          </div>
        </li>
        <li className='relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
          <div className='flex items-center mt-3 md:mt-0'>
            <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-300 rounded-full ring-0 ring-white dark:bg-primary-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
              3
            </div>
            <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
          </div>
          <div className='mt-3 sm:pr-8'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Get Recovery Link
              {/* <span>{recData ? '✅' : '⏳'}</span> */}
            </h3>
            <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Recusandae, sed?
            </p>
          </div>
        </li>
      </ol>
      <hr className='mt-20 dark:opacity-30 ' />
      <section className='flex flex-col max-w-2xl mx-auto my-14'>
        <h2 className='text-4xl font-bold text-center'>1. Login to Account</h2>
        <form className='mt-6 flex flex-col gap-4 max-w-2xl w-full mx-auto'>
          <div className='flex flex-row gap-4'>
            <div className='w-full'>
              <label
                htmlFor='account'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                Account ID
              </label>
              <input
                type='text'
                id='account'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='test.testnet'
                required=''
                onChange={(e) => setAccountID(e.target.value)}
                value={accountID}
              />
            </div>
          </div>
          <button
            type='submit'
            className='bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={(e) => {
              e.preventDefault();
              login();
            }}>
            {checkTxt}
          </button>
        </form>
        {/* <button
          // disabled={flowState !== 'begin'}
          className='mt-6 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => {
            // setFlowState('signed');
            // loginFull();
          }}> */}
        {/* {flowState === 'begin' ? 'Sign in with NEAR' : 'Signed In'} */}
        {/* </button> */}
      </section>
      <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' />
      <section className='flex flex-col max-w-2xl mx-auto my-14'>
        <h2 className='text-4xl font-bold text-center'>2. Request Recovery </h2>
        <button
          // disabled={flowState !== 'begin'}
          className='mt-6 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => {
            recoverAccount();
          }}>
          Request
        </button>
      </section>
      <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' />
      <section className='flex flex-col max-w-2xl mx-auto my-14'>
        <h2 className='text-4xl font-bold text-center'>
          3. Get Recovery Link{' '}
        </h2>
        <p className='mx-auto mt-6'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        </p>
      </section>
    </main>
  );
};

export default Recover;
