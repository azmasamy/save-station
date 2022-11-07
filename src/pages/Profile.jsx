import React, { useEffect, useState } from 'react';
import { getBlob, ref } from 'firebase/storage';

import { storage } from '../utils/firebase';
import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';

// import wasm from '../wasm_files/near-recovery-key.wasm';

const Profile = ({ logout, loginFull, acc, nearConnection }) => {
  const [deployTxt, setDeployTxt] = useState('Deploy');
  const [deployedState, setDeployedState] = useState('');

  const [flowState, setFlowState] = useState('begin');

  const [recTxt, setRecTxt] = useState('Update Recovery Data');

  const [recAcc, setRecAcc] = useState('');
  const [recDate, setRecDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [recData, setRecData] = useState(null);

  const deployRecoveryKeyContract = async () => {
    setDeployTxt('Deploying...');
    const nearAccount = await nearConnection.account();
    nearAccount.accountId = acc.accountId;

    const wasmRef = ref(
      storage,
      'gs://save-station.appspot.com/near-recovery-key.wasm'
    );

    getBlob(wasmRef).then(async (wasm) => {
      const wasmArrayBuffer = await wasm.arrayBuffer();
      const wasmUint8Array = new Uint8Array(wasmArrayBuffer);
      const response = await nearAccount.deployContract(wasmUint8Array);
      console.log(response);
      setDeployedState('ours');
      setFlowState('deployed');
      setDeployTxt('Deployed ✅');
      toast.success(`Contract deployed successfully`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  const setRecoveryData = async () => {
    if (recAcc === '' || recDate === '') {
      toast.error(`Please fill all the fields`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setRecTxt('Setting...');
    // convert recDate to number of seconds
    const recDateSecs = Math.floor(
      new Date(recDate || '2022-10-28').getTime() / 1000
    ).toString();

    const nearAccount = await nearConnection.account();
    nearAccount.accountId = acc.accountId;

    nearAccount
      .signAndSendTransaction({
        receiverId: acc.accountId,
        actions: [
          transactions.functionCall(
            'setRecoveryState',
            {
              recoveryAccount: recAcc,
              recoveryDate: recDateSecs,
            },
            30000000000000,
            0
          ),
        ],
      })
      .then((res) => {
        toast.success(`Data updated successfully`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRecTxt('Update Recovery Data');
        setRecData({
          ...recData,
          recoveryAccount: recAcc,
          recoveryDate: recDateSecs,
          isRecovered: 'false',
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Please deploy the contract first`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRecTxt('Update Recovery Data');
      });
  };

  const [why, setWhy] = useState('nth');

  useEffect(() => {
    setWhy(window.localStorage.getItem('save_station') || 'nth');
  }, []);

  // Get Current State
  useEffect(() => {
    if (deployedState === 'ours') {
      const getRecoveryData = async () => {
        const nearAccount = await nearConnection.account();
        nearAccount.accountId = acc.accountId;

        let myDate;

        nearAccount
          .viewFunction(acc.accountId, 'viewRecoveryState', {})
          .then((res) => {
            try {
              myDate = new Date(
                parseInt(res?.recoveryDate || 1666828800) * 1000
              )
                .toISOString()
                .split('T')[0];
              setRecData(res);
            } catch {
              myDate = new Date().toISOString().split('T')[0];
              setRecData(null);
            }
            setRecAcc(res?.recoveryAccount);
            setRecDate(myDate);
          })
          .catch((err) => {});
      };

      try {
        getRecoveryData();
      } catch (err) {
        console.log(err);
      }
    }
  }, [deployedState, acc, nearConnection]);

  useEffect(() => {
    if (acc) setFlowState('signed');
    else setFlowState('begin');

    if (acc) {
      const checkDeployed = async () => {
        const response = await nearConnection.connection.provider.query({
          request_type: 'view_account',
          finality: 'final',
          account_id: acc?.accountId,
        });

        if (response.code_hash === '11111111111111111111111111111111') {
          setDeployedState('empty');
        } else if (
          response.code_hash === 'GdAnSBMFXdvWHsrsMAqPNHZh6VDq4JEaiNj5s4Xf9E9d'
        ) {
          setDeployedState('ours');
          setFlowState('deployed');
        } else {
          setDeployedState('other');
        }
      };

      checkDeployed();
    }
  }, [acc, nearConnection]);

  return (
    <main className='max-w-screen-lg px-6 py-8 md:px-8 md:py-16 mx-auto relative'>
      {why === 'recover' ? (
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
            Backup Account
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
                  Login with NEAR{' '}
                  <span>{flowState !== 'begin' ? '✅' : '⏳'}</span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  login with your near account to a completly secure account
                  that is{' '}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    className='underline underline-offset-2 decoration-1'
                    href='https://explorer.testnet.near.org/accounts/savestation.testnet'>
                    locked
                  </a>
                  , doesn't have a smart contract, and no one can access it.
                </p>
              </div>
            </li>
            <li className='w-full relative mb-6 sm:mb-0  flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex items-center mt-3 md:mt-0'>
                {flowState === 'begin' || flowState === 'signed' ? (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-slate-300 rounded-full ring-0 ring-white dark:bg-slate-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
                    2
                  </div>
                ) : (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                    2
                  </div>
                )}
                {flowState === 'begin' || flowState === 'signed' ? (
                  <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
                ) : (
                  <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
                )}
              </div>
              <div className='mt-3 sm:pr-8'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Deploy Backup Contract{' '}
                  <span>
                    {(flowState === 'deployed' && deployedState === 'ours') ||
                    flowState === 'deployed'
                      ? '✅'
                      : '⏳'}
                  </span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  Deploy a special smart contract that allows you to recover
                  your account through another NEAR account.
                </p>
              </div>
            </li>
            <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex items-center mt-3 md:mt-0'>
                {recData ? (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                    3
                  </div>
                ) : (
                  <div className='flex z-10 justify-center items-center w-6 h-6 bg-slate-300 rounded-full ring-0 ring-white dark:bg-slate-700 sm:ring-8 dark:ring-gray-900 shrink-0'>
                    3
                  </div>
                )}
                {recData ? (
                  <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
                ) : (
                  <div className='hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700'></div>
                )}
              </div>
              <div className='mt-3 sm:pr-8'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Set Backup Details <span>{recData ? '✅' : '⏳'}</span>
                </h3>
                <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                  Set the the NEAR recovery account that will be able to recover
                  your account after a backup date you specify.
                </p>
              </div>
            </li>
          </ol>
          <hr className='mt-20 dark:opacity-30 ' />
          {flowState === 'begin' && (
            <>
              <section className='flex flex-col max-w-2xl mx-auto my-14'>
                <h2 className='text-4xl font-bold text-center'>
                  Login with NEAR
                </h2>
                <button
                  disabled={flowState !== 'begin'}
                  className='mt-6 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={() => {
                    loginFull();
                  }}>
                  {flowState === 'begin' ? 'Login with NEAR' : 'Signed In'}
                </button>
              </section>
            </>
          )}
          {/* <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' /> */}
          {flowState === 'signed' && (
            <>
              <section className='flex flex-col max-w-2xl mx-auto my-14'>
                <h2 className='mb-6 text-4xl font-bold text-center'>
                  Deploy the Contract
                </h2>
                {deployedState === 'other' && (
                  <div
                    className='p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800'
                    role='alert'>
                    <span className='font-medium'>Warning!</span> This account
                    already has a deployed contract, deploying the recovery
                    contract will delete the old one.
                  </div>
                )}
                <button
                  disabled={deployedState === 'ours'}
                  className='bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={deployRecoveryKeyContract}>
                  {deployedState === 'ours' ? 'Contract Deployed' : deployTxt}
                </button>
              </section>
            </>
          )}
          {/* <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' /> */}
          {flowState === 'deployed' && (
            <>
              <section className='mt-12 mb-6 max-w-2xl mx-auto'>
                <h2 className='mt-6 mb-10 text-4xl font-bold text-center'>
                  Set Recovery Details
                </h2>
                {recData && (
                  <div className='mb-6 p-4 border-2 border-slate-500 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent opacity-70'>
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
                {deployedState !== 'ours' && (
                  <div
                    className='p-4 mb-4 text-sm text-primary-700 bg-primary-100 rounded-lg dark:bg-primary-200 dark:text-primary-800'
                    role='alert'>
                    Please deploy the contract first, to be able to add the
                    recovery details.
                  </div>
                )}
                <form className='flex flex-col gap-4 max-w-2xl mx-auto'>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='w-full'>
                      <label
                        htmlFor='account'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Recovery Account
                      </label>
                      <input
                        type='text'
                        id='account'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='test.testnet'
                        required=''
                        onChange={(e) => setRecAcc(e.target.value)}
                        value={recAcc}
                      />
                    </div>
                    <div className='w-full'>
                      <label
                        htmlFor='date'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Recovery date
                      </label>
                      <input
                        type='date'
                        id='date'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        required=''
                        onChange={(e) => setRecDate(e.target.value)}
                        value={recDate}
                      />
                    </div>
                  </div>
                  <button
                    disabled={deployedState !== 'ours'}
                    type='submit'
                    className='bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={(e) => {
                      e.preventDefault();
                      setRecoveryData();
                    }}>
                    {recTxt}
                  </button>
                </form>
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Profile;
