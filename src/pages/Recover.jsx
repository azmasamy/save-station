import { useNavigate, useSearchParams } from 'react-router-dom';

import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';
import txt from '../utils/text.json';
import { useEffect } from 'react';
import { useState } from 'react';

const Recover = ({ logout, acc, nearConnection, signIn }) => {
  const [accountID, setAccountID] = useState('');
  const [btnTxt, setBtnTxt] = useState('Recover Account');
  const [recLink, setRecLink] = useState('');

  const [flowState, setFlowState] = useState('begin');

  const [searchParams, setSearchParams] = useSearchParams();
  const reload = searchParams.get('reload');

  const navigate = useNavigate();

  const [recData, setRecData] = useState(null);

  const [why, setWhy] = useState('');

  const [cantRecover, setCantRecover] = useState('can');

  useEffect(() => {
    setWhy(window.localStorage.getItem('save_station') || 'nth');
    if (reload) {
      window.localStorage.setItem('save_station', 'recover');

      navigate('/recover');
      navigate(0);
    }
  }, []);

  useEffect(() => {
    // if recoveryDate hasn't come yet
    if (recData?.recoveryDate > Date.now()) setCantRecover('date');
    else if (recData?.isRecovered === 'true') setCantRecover('rec');
    else if (recData?.recoveryAccount !== acc?.accountId) setCantRecover('acc');
    else setCantRecover('can');
  }, [recData, acc]);

  useEffect(() => {
    if (acc) setFlowState('signed');
    if (window.localStorage.getItem('recovery_link')) {
      setFlowState('requested');
      setRecLink(window.localStorage.getItem('recovery_link'));
    }
    if (window.localStorage.getItem('ss_clicked')) {
      setFlowState('recovered');
    }
    const recoveredAccount = window.localStorage.getItem('accountID');

    const checkRecData = async () => {
      const nearAccount = await nearConnection.account();
      nearAccount.accountId = acc.accountId;
      nearAccount
        .viewFunction(recoveredAccount, 'viewRecoveryState', {})
        .then((res) => {
          setRecData(res);
          console.log(res);
        })
        .catch((err) => {});
    };
    if (flowState === 'signed') {
      checkRecData();
    }
  }, [acc, flowState, nearConnection]);

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

    const response = await nearConnection.connection.provider.query({
      request_type: 'view_account',
      finality: 'final',
      account_id: accountID,
    });

    let isOurs = false;
    if (response.code_hash === '3AMXkV2PnP4Qni26dZLK7XijGfiBgyqBvPC9fvzHaX77') {
      isOurs = true;
    } else {
      isOurs = false;
    }

    if (!isOurs) {
      toast.error('This account is not backed up');
      return;
    }

    window.localStorage.setItem('accountID', accountID);

    signIn(accountID);

    // const link = `https://wallet.testnet.near.org/login/?success_url=${
    //   window.location.origin + '/%23%0A/redirect2/'
    // }&failure_url=${
    //   window.location.origin + '/%23%0A/redirect2/'
    // }&contract_id=${accountID}`;

    // window.location.href = link;
  };

  const errorMap = {
    date: 'Recovery date has not come yet',
    acc: 'This account is not the recovery account',
    rec: 'This account has already been recovered',
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

    const recoveredAccount = window.localStorage.getItem('accountID');

    let oldKeys = [];

    const response = await nearConnection.connection.provider.query({
      request_type: 'view_access_key_list',
      finality: 'final',
      account_id: recoveredAccount,
    });

    response.keys.forEach((key) => {
      if (key.access_key.permission === 'FullAccess') {
        oldKeys.push(key.public_key.replace('ed25519:', ''));
      }
    });

    // console.log(oldKeys);

    const nearAccount = await nearConnection.account();
    nearAccount.accountId = acc.accountId;

    const modifiedPubKey = myPublicKey.replace('ed25519:', '');

    nearAccount
      .signAndSendTransaction({
        receiverId: recoveredAccount,
        actions: [
          transactions.functionCall(
            'recoverAccount',
            {
              // publicKey: myPublicKey,
              newFullAccessKey: modifiedPubKey,
              oldFullAccessKeys: oldKeys,
            },
            300000000000000,
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
        setFlowState('requested');
        setBtnTxt('Recovered');
        setRecLink(
          `https://wallet.testnet.near.org/auto-import-secret-key#${recoveredAccount}/${myPrivateKey}`
        );
        window.localStorage.setItem(
          'recovery_link',
          `https://wallet.testnet.near.org/auto-import-secret-key#${recoveredAccount}/${myPrivateKey}`
        );
      })
      .catch((err) => {
        // console.log(err);
        if (err?.kind?.ExecutionError.includes('Access denied'))
          toast.error(`You don't have access to recover this account`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        else if (err?.kind?.ExecutionError.includes('Date'))
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
      {why === 'setup' ? (
        <div className='grid items-center py-10'>
          <h1 className='text-4xl font-bold text-center mb-8'>
            Please log out first
          </h1>
          <button
            onClick={logout}
            title='Log Out'
            className='mx-auto w-fit bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-sm rounded-lg px-5 py-2.5 text-center'>
            Log Out
          </button>
        </div>
      ) : (
        <>
          <h2 className='mb-10 text-4xl font-bold text-center'>
            Recover Account
          </h2>
          <ol className='md:flex items-start justify-start'>
            <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex items-center'>
                {flowState === 'begin' ? (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-slate-300 rounded-full ring-0 ring-white dark:bg-slate-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
                    1
                  </div>
                ) : (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                    1
                  </div>
                )}
                {flowState === 'begin' ? (
                  <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
                ) : (
                  <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
                )}
              </div>
              <div className='mt-3 sm:pr-8'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {txt.recover_1 + ' '}
                  <span>{flowState !== 'begin' ? '✅' : '⏳'}</span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  {txt.recover_1_details}
                </p>
              </div>
            </li>
            <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex items-center mt-3 md:mt-0'>
                {flowState === 'signed' || flowState === 'begin' ? (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-slate-300 rounded-full ring-0 ring-white dark:bg-slate-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
                    2
                  </div>
                ) : (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                    2
                  </div>
                )}
                {flowState === 'signed' || flowState === 'begin' ? (
                  <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
                ) : (
                  <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
                )}
              </div>
              <div className='mt-3 sm:pr-8'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {txt.recover_2 + ' '}
                  <span>
                    {flowState === 'signed' || flowState === 'begin'
                      ? '⏳'
                      : '✅'}
                  </span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  {txt.recover_2_details}
                </p>
              </div>
            </li>
            <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex items-center mt-3 md:mt-0'>
                {flowState === 'recovered' ? (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                    3
                  </div>
                ) : (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-slate-300 rounded-full ring-0 ring-white dark:bg-slate-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
                    3
                  </div>
                )}
                {flowState === 'recovered' ? (
                  <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
                ) : (
                  <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
                )}
              </div>
              <div className='mt-3 sm:pr-8'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {txt.recover_3 + ' '}
                  <span>{flowState === 'recovered' ? '✅' : '⏳'}</span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  {txt.recover_3_details}
                </p>
              </div>
            </li>
          </ol>
          <hr className='mt-20 dark:opacity-30 ' />
          {flowState === 'begin' && (
            <>
              <section className='flex flex-col max-w-2xl mx-auto my-14'>
                <h2 className='text-4xl font-bold text-center'>
                  Login to Account
                </h2>
                <form className='mt-6 flex flex-col gap-4 max-w-2xl w-full mx-auto'>
                  <div className='flex flex-row gap-4'>
                    <div className='w-full'>
                      <label
                        htmlFor='account'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Backed-up Account ID
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
              </section>
            </>
          )}

          {/* <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' /> */}
          {flowState === 'signed' && (
            <>
              <section className='flex flex-col max-w-2xl mx-auto my-14'>
                <h2 className='text-4xl font-bold text-center'>
                  Request Recovery{' '}
                </h2>
                {recData && (
                  <div className='mt-6 mb-0 p-4 border-2 border-slate-500 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent opacity-70'>
                    <h2 className='mb-4 text-4xl font-bold text-center'>
                      Current State
                    </h2>
                    <div className='flex flex-col sm:flex-row items-center text-center justify-between w-full'>
                      <div className='border-b-2 sm:border-b-0 border-slate-600 dark:border-slate-400 p-4'>
                        <h1 className='text-xl font-semibold text-center'>
                          Recovery Account
                        </h1>
                        <p>{recData?.recoveryAccount}</p>
                      </div>
                      <div className='border-b-2 sm:border-b-0 border-slate-600 dark:border-slate-400 p-4'>
                        <h1 className='text-xl font-semibold text-center'>
                          Recovery Date
                        </h1>
                        <p>
                          {
                            new Date(
                              (recData?.recoveryDate || 1666828800) * 1000
                            )
                              .toISOString()
                              .split('T')[0]
                          }
                        </p>
                      </div>
                      <div className='p-4 pb-1 sm:p-4'>
                        <h1 className='text-xl font-semibold text-center'>
                          is Recovered?
                        </h1>
                        <p>{recData?.isRecovered}</p>
                      </div>
                    </div>
                  </div>
                )}
                {cantRecover === 'can' && (
                  <div
                    className='mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
                    role='alert'>
                    <span className='font-medium'>Warning! </span>
                    Any old full-access keys associated with the account will be
                    removed
                  </div>
                )}
                <button
                  disabled={cantRecover !== 'can'}
                  className={
                    cantRecover !== 'can'
                      ? 'mt-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 focus:ring-4 focus:outline-none text-white focus:ring-red-300 dark:focus:ring-red-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'mt-6 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                  }
                  onClick={() => {
                    recoverAccount();
                    setFlowState('requested');
                  }}>
                  {cantRecover === 'can' ? btnTxt : errorMap[cantRecover]}
                </button>
              </section>
            </>
          )}
          {/* <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' /> */}
          {recLink && (
            <>
              <section className='flex flex-col max-w-2xl mx-auto my-14'>
                <h2 className='text-4xl font-bold text-center'>
                  Recover Account
                </h2>
                {/* <div
                  className='mt-6 p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800'
                  role='alert'>
                  <span className='font-medium'>Take Care!</span> Don't share
                  this link with anyone
                </div> */}
                <div
                  className='mt-6 p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
                  role='alert'>
                  <span className='font-medium'>Warning!</span>
                  <br />• Don't share this link with anyone
                  <br />• You must login with this link or the account will be
                  lost forever
                  <br />• Add a new passphrase once you've recovered your
                  account
                </div>
                <div
                  className='relative cursor-pointer'
                  title='Click to copy'
                  onClick={() => {
                    navigator.clipboard.writeText(recLink);
                    toast.success('Copied to clipboard');
                  }}>
                  <p
                    className='border-[1px] p-2 pr-7 rounded-lg'
                    style={{ wordBreak: 'break-all' }}>
                    {recLink}
                  </p>
                  <svg
                    className='w-6 h-6 absolute right-1 top-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'></path>
                  </svg>
                </div>
                <button
                  className='mt-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={() => {
                    setFlowState('recovered');
                    window.localStorage.setItem('ss_clicked', 'true');
                    window.open(recLink, '_blank');
                  }}
                  target='_blank'
                  rel='noreferrer'>
                  Recover Account
                </button>
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Recover;
