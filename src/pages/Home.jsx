import { Link } from 'react-router-dom';
import txt from '../utils/text.json';
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
          <h1 className='text-5xl font-bold max-w-[18ch] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700'>
            Save Station
          </h1>
          <h2 className='text-3xl font-semibold max-w-[36ch] leading-tight'>
            Never lose access to your account!
          </h2>
          <p className='text-2xl font-light opacity-90 max-w-[55ch] pb-3'>
            Allow another account to gain access to yours when you are dead! or
            if you lose access for any reason. 3 easy steps to{' '}
            <span
              onClick={handleBackupClick}
              className='relative z-10 cursor-pointer before:absolute before:w-[calc(100%+4px)] before:left-[-2px] before:h-[2px] before:bottom-0 dark:before:bg-[#DE9822] before:bg-[#F2C346] before:-z-10 hover:before:h-full before:transition-[height]'>
              backup
            </span>{' '}
            and{' '}
            <span
              onClick={handleRecoveryClick}
              className='relative cursor-pointer before:absolute before:w-[calc(100%+4px)] before:left-[-2px] before:h-[2px] before:bottom-0 dark:before:bg-[#DE9822] before:bg-[#F2C346] before:-z-10 hover:before:h-full before:transition-[height]'>
              recover
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
        className='relative flex flex-col h-screen items-center justify-center gap-12'
        ref={backupRef}>
        {/* <div className='w-[400px] h-[160px] absolute bg-primary-600 bg-opacity-25 rounded-full overflow-hidden blur-3xl left-[calc(50%-200px)] top-2 z-[1]'></div> */}
        <h2 className='text-4xl font-bold text-center'>Backup Steps</h2>
        <ol className='md:flex items-start justify-start'>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                1
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {txt.backup_1}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.backup_1_details_a}
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='underline underline-offset-2 decoration-1'
                  href='https://explorer.testnet.near.org/accounts/savestation.testnet'>
                  locked
                </a>
                {txt.backup_1_details_b}
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
                {txt.backup_2}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.backup_2_details}
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
                {txt.backup_3}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.backup_3_details}
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
        <ol className='md:flex items-start justify-start'>
          <li className='w-full relative mb-6 sm:mb-0 flex sm:block flex-col items-center text-center sm:items-start sm:text-left'>
            <div className='flex items-center'>
              <div className='flex z-10 justify-center items-center w-6 h-6 bg-primary-500 rounded-full ring-0 ring-white dark:bg-primary-700 text-white sm:ring-8 dark:ring-gray-900 shrink-0'>
                1
              </div>
              <div className='hidden sm:flex w-full bg-primary-500 h-0.5 dark:bg-primary-700'></div>
            </div>
            <div className='mt-3 sm:pr-8'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                {txt.recover_1}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.recover_1_details}
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
                {txt.recover_2}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.recover_2_details}
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
                {txt.recover_3}
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                {txt.recover_3_details}
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
