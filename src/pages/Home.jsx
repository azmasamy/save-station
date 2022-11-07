import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Home = () => {
  const backupRef = useRef(null);
  const recoveryRef = useRef(null);

  const handleBackupClick = () => {
    backupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleRecoveryClick = () => {
    recoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className='max-w-screen-lg px-4 py-8 md:pt-24 md:pb-16 mx-auto relative'>
      <div className='w-[500px] h-[500px] hidden dark:block absolute bg-primary-600 bg-opacity-25 rounded-full overflow-hidden blur-3xl -right-10 top-16 z-[1]'></div>
      <section className='flex flex-col-reverse gap-4 md:flex-row justify-between items-center'>
        <div className='space-y-5'>
          <h2 className='text-5xl font-bold max-w-[18ch] leading-tight'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700'>
              Save Station
            </span>
            {'\n'}
            KEEPS YOU ALIVE!
          </h2>
          <p className='font-light opacity-90 max-w-[55ch] pb-3'>
            Never lose your NEAR account ever again! Save Station allows you to
            backup your account and recover it using another near account that
            you specify.
            <br></br>
            <br></br>
            All you have to do is login with your near account to a completly
            secure account that is{' '}
            <a
              target='_blank'
              rel='noreferrer'
              className='relative cursor-pointer before:absolute before:w-[calc(100%+4px)] before:left-[-2px] before:h-[2px] before:bottom-0 dark:before:bg-primary-600 before:bg-primary-400 before:-z-10 hover:before:h-full before:transition-[height]'
              href='https://explorer.testnet.near.org/accounts/savestation.testnet'>
              locked
            </a>
            , doesn't have a smart contract, and no one can access it and follow
            the{' '}
            <span
              onClick={handleBackupClick}
              className='relative z-10 cursor-pointer before:absolute before:w-[calc(100%+4px)] before:left-[-2px] before:h-[2px] before:bottom-0 dark:before:bg-[#DE9822] before:bg-[#F2C346] before:-z-10 hover:before:h-full before:transition-[height]'>
              backup steps
            </span>
            .<br></br>
            <br></br>
            If you ever lose access to your account you can recover it using the
            other account you specified by following the{' '}
            <span
              onClick={handleRecoveryClick}
              className='relative cursor-pointer before:absolute before:w-[calc(100%+4px)] before:left-[-2px] before:h-[2px] before:bottom-0 dark:before:bg-[#DE9822] before:bg-[#F2C346] before:-z-10 hover:before:h-full before:transition-[height]'>
              recovery steps
            </span>
            .
          </p>
          <div className='sm:block sm:space-x-4 flex flex-col gap-2'>
            <Link
              to='/profile'
              className='inline-block text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg px-5 py-2.5 text-center'>
              Backup Account
            </Link>
            <Link
              to='/recover'
              className='relative inline-flex items-center justify-center p-[3px] overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'>
              <span className='relative w-full text-center px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                Recover Account
              </span>
            </Link>
          </div>
        </div>
        <img
          src='https://res.cloudinary.com/omar45/image/upload/v1666775913/NEAR/password_save.png'
          alt='password lock'
          className='bounce-animation w-96 aspect-square z-[2]'
        />
      </section>
      <section
        className='relative flex flex-col h-screen items-center justify-center gap-16'
        ref={backupRef}>
        {/* <div className='w-[400px] h-[160px] absolute bg-primary-600 bg-opacity-25 rounded-full overflow-hidden blur-3xl left-[calc(50%-200px)] top-2 z-[1]'></div> */}
        <h2 className='text-4xl font-bold text-center'>Backup Steps</h2>
        <ol className='items-center md:flex'>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                1
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Login with NEAR
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                login with your near account to a completly secure account that
                is{' '}
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
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center mt-3 md:mt-0'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                2
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Deploy Backup Contract{' '}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                Deploy a special smart contract that allows you to recover your
                account through another NEAR account even if you've lost access
                to it.
              </p>
            </div>
          </li>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center mt-3 md:mt-0'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                3
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Set Backup Details
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                Set the the NEAR recovery account that will be able to recover
                your account after a backup date you specify.
              </p>
            </div>
          </li>
        </ol>
        <Link
          to='/profile'
          className='inline-flex items-center justify-center gap-2 text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg px-5 py-2.5 text-center'>
          Backup your account now
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M17 8l4 4m0 0l-4 4m4-4H3'></path>
          </svg>
        </Link>
      </section>
      <section
        className='relative flex flex-col h-screen items-center justify-center gap-16'
        ref={recoveryRef}>
        {/* <div className='w-[400px] h-[160px] absolute bg-primary-600 bg-opacity-25 rounded-full overflow-hidden blur-3xl left-[calc(50%-200px)] top-2 z-[1]'></div> */}
        <h2 className='text-4xl font-bold text-center'>Recover Steps</h2>
        <ol className='items-center md:flex'>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                1
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                Login to Account{' '}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                Login to the backed-up account you want to recover.
              </p>
            </div>
          </li>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center mt-3 md:mt-0'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                2
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                Request Recovery{' '}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                Request a magical link that lets you recover the backed-up
                account.
              </p>
            </div>
          </li>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center mt-3 md:mt-0'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                3
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                Recover Account{' '}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                Recover the account through the magical link.
              </p>
            </div>
          </li>
        </ol>
        <Link
          to='/recover'
          className='inline-flex items-center justify-center gap-2 text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg px-5 py-2.5 text-center'>
          Recover your account
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M17 8l4 4m0 0l-4 4m4-4H3'></path>
          </svg>
        </Link>
      </section>
    </main>
  );
};

export default Home;
