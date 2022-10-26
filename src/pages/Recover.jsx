import { toast } from 'react-toastify';
import { transactions } from 'near-api-js';
import { useState } from 'react';

const Recover = ({ login, acc, nearConnection }) => {
  const [accountID, setAccountID] = useState('');
  const [btnTxt, setBtnTxt] = useState('Recover Account');

  const recoverAccount = async () => {
    setBtnTxt('Recovering...');

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
      <h2 className='mb-4 text-4xl font-bold text-center'>Recover Account</h2>
      {acc ? (
        <>
          <form className='flex flex-col gap-4 max-w-2xl mx-auto'>
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
                recoverAccount();
              }}>
              {btnTxt}
            </button>
          </form>
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

export default Recover;
