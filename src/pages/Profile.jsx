import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';
import wasm from '../wasm_files/near-recovery-key.wasm';

const Profile = ({ login, acc, nearConnection }) => {
  const [deployTxt, setDeployTxt] = useState('Deploy');
  const [deployed, setDeployed] = useState(false);

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

    fetch(wasm)
      .then((r) => r.blob())
      .then(async (blob) => {
        const wasmArrayBuffer = await blob.arrayBuffer();
        const wasmUint8Array = new Uint8Array(wasmArrayBuffer);
        const response = await nearAccount.deployContract(wasmUint8Array);
        console.log(response);
        setDeployed(true);
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
      new Date(recDate).getTime() / 1000
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
          isRecovered: recData?.isRecovered || 'false',
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

  useEffect(() => {
    const getRecoveryData = async () => {
      const nearAccount = await nearConnection.account();
      nearAccount.accountId = acc.accountId;

      nearAccount
        .viewFunction(acc.accountId, 'viewRecoveryState', {})
        .then((res) => {
          setRecData(res);
          setRecAcc(res.recoveryAccount);
          setRecDate(
            new Date(parseInt(res.recoveryDate) * 1000)
              .toISOString()
              .split('T')[0]
          );
        })
        .catch((err) => {});
    };

    const checkDeployed = async () => {
      const nearAccount = await nearConnection.account();
      nearAccount.accountId = acc.accountId;

      nearAccount
        .viewFunction(acc.accountId, 'getCurrentTimestamp', {})
        .then((res) => {
          setDeployed(true);
        })
        .catch((err) => {
          setDeployed(false);
        });
    };

    try {
      getRecoveryData();
    } catch (err) {
      console.log(err);
    }

    try {
      checkDeployed();
    } catch (err) {
      setDeployed(false);
    }
  }, [acc, nearConnection]);

  // setRecoveryState(recoveryAccount: string, recoveryDate: u64)
  // deploy wasm
  // set settings:
  //    - date
  //    - which recovery account

  return (
    <main className='max-w-screen-lg px-6 py-8 md:px-8 md:py-16 mx-auto relative'>
      {recData && (
        <div className='mb-12 p-4 border-2 border-slate-500 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent opacity-70'>
          <h2 className='mb-4 text-4xl font-bold text-center'>Current State</h2>
          <div className='flex flex-col sm:flex-row items-center text-center '>
            <div className='w-full border-b-2 sm:border-r-2 sm:border-b-0 border-slate-600 dark:border-slate-400 p-4'>
              <h1 className='text-xl font-semibold text-center'>
                Recovery Account
              </h1>
              <p>{recData?.recoveryAccount}</p>
            </div>
            <div className='w-full border-b-2 sm:border-r-2 sm:border-b-0 border-slate-600 dark:border-slate-400 p-4'>
              <h1 className='text-xl font-semibold text-center'>
                Recovery Date
              </h1>
              <p>
                {
                  new Date(recData?.recoveryDate * 1000)
                    .toISOString()
                    .split('T')[0]
                }
              </p>
            </div>
            <div className='w-full p-4 pb-1 sm:p-4'>
              <h1 className='text-xl font-semibold text-center'>
                is Recovered?
              </h1>
              <p>{recData?.isRecovered}</p>
            </div>
          </div>
        </div>
      )}
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
              Deploy the Contract
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
              Add a Recovery Account
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
              Set a Recovery Date
            </h3>
            <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Recusandae, sed?
            </p>
          </div>
        </li>
      </ol>
      <hr className='mt-20 dark:opacity-30 ' />
      {acc ? (
        <>
          <section className='flex flex-col max-w-2xl mx-auto my-14'>
            <h2 className='mb-6 text-4xl font-bold text-center'>
              Deploy the Contract
            </h2>
            <button
              disabled={deployed || recData}
              className='bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-lg rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={deployRecoveryKeyContract}>
              {deployed || recData ? 'Contract Deployed' : deployTxt}
            </button>
          </section>
          <hr className='dark:opacity-30 border-none max-w-2xl mx-auto h-[2px] dark:bg-white bg-[repeating-linear-gradient(90deg,#000,#000_6px,transparent_6px,transparent_12px)] dark:bg-[repeating-linear-gradient(90deg,#111827,#111827_6px,transparent_6px,transparent_12px)]' />
          <section className='mt-12 mb-6'>
            <h2 className='mt-6 mb-10 text-4xl font-bold text-center'>
              Recovery Account & Date
            </h2>
            <form className='flex flex-col gap-4 max-w-2xl mx-auto'>
              <div className='flex flex-row gap-4'>
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
      ) : (
        <>
          <section className='flex flex-col max-w-2xl mx-auto my-20'>
            <h2 className='mb-6 text-4xl font-bold text-center'>
              Connect your Account
            </h2>
            <button
              className='bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-sm rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={login}>
              Login with NEAR
            </button>
          </section>
        </>
      )}
    </main>
  );
};

export default Profile;
