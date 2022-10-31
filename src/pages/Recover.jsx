import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';
import { useEffect } from 'react';
import { useState } from 'react';

const Recover = ({ wallet, acc, nearConnection }) => {
  const [accountID, setAccountID] = useState('');
  const [btnTxt, setBtnTxt] = useState('Recover Account');
  const [recLink, setRecLink] = useState('');

  const [flowState, setFlowState] = useState('begin');

  useEffect(() => {
    if (acc) setFlowState('signed');
    else setFlowState('begin');
  }, [acc]);

  const login = async () => {
    // add accountID to localStorage
    // TODO check if account exists first
    let isFound = true;
    await nearConnection.account(accountID).then((account) => {
      account
        .state()
        .then(() => {
          isFound = true;
        })
        .catch((err) => {
          isFound = false;
          toast.error('Account does not exist');
        });
    });

    if (!isFound) return;

    await nearConnection.account(accountID).then((account) => {
      account
        .state()
        .then(() => {
          window.localStorage.setItem('accountID', accountID);
          wallet.requestSignIn({
            contractId: accountID,
            successUrl: window.location.origin + '/#/redirect2',
          });
        })
        .catch((err) => {});
    });
  };

  const recoverAccount = async () => {
    setBtnTxt('Recovering...');

    // TODO: add another redirect page

    // * Generate key-pair
    // * send the public one to the contract function
    // if it didn't panic, return the recovery link
    // * recoveryLink: https://wallet.testnet.near.org/auto-import-secret-key#YOUR_ACCOUNT_ID/YOUR_PRIVATE_KEY
    // * add a warning to the user that they should not share the link with anyone
    // maybe add a redirect button to recover the account

    const myKeyPair = KeyPairEd25519.fromRandom();
    const myPublicKey = myKeyPair.getPublicKey().toString();
    const myPrivateKey = myKeyPair.toString();

    const nearAccount = await nearConnection.account();
    nearAccount.accountId = acc.accountId;

    const recoveredAccount = window.localStorage.getItem('accountID');

    nearAccount
      .signAndSendTransaction({
        receiverId: recoveredAccount,
        actions: [
          transactions.functionCall(
            'recoverAccount',
            {
              publicKey: myPublicKey,
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
        setRecLink(
          `https://wallet.testnet.near.org/auto-import-secret-key#${recoveredAccount}/${myPrivateKey}`
        );
        setFlowState('recovered');
      })
      .catch((err) => {
        console.log(err);
        if (err.kind.ExecutionError.includes('Access denied'))
          toast.error(`You don't have access to recover this account`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        else if (err.kind.ExecutionError.includes('Date'))
          toast.error(`Recovery date was not reached yet`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        else
          toast.error(`Account has already been recovered`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        setBtnTxt('Error');
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
        {flowState === 'begin' && (
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
              Login to Account
            </button>
          </form>
        )}
      </section>
      <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' />
      <section className='flex flex-col max-w-2xl mx-auto my-14'>
        <h2 className='text-4xl font-bold text-center'>2. Request Recovery </h2>
        {flowState === 'signed' && (
          <button
            className='mt-6 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => {
              recoverAccount();
            }}>
            {btnTxt}
          </button>
        )}
      </section>
      <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' />
      <section className='flex flex-col max-w-2xl mx-auto my-14'>
        <h2 className='text-4xl font-bold text-center'>
          3. Get Recovery Link{' '}
        </h2>
        {recLink && (
          <>
            <div
              className='mt-6 p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800'
              role='alert'>
              <span className='font-medium'>Warning!</span> Don't share this
              link with anyone
            </div>
            <a
              href={recLink}
              target='_blank'
              rel='noreferrer'
              style={{ wordBreak: 'break-all' }}
              // className='truncate'
            >
              {recLink}
            </a>
          </>
        )}
      </section>
    </main>
  );
};

export default Recover;
