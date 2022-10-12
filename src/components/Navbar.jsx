import { DarkThemeToggle } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Navbar = ({ login, logout, acc }) => {
  return (
    <header>
      <nav className='bg-white border-gray-200 px-4 lg:px-6 py-4 dark:bg-gray-800 shadow-md z-10'>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-lg'>
          <Link to='/' className='flex items-center'>
            <svg
              className='w-10 h-10 mr-2 dark:text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'></path>
            </svg>
            <span className='hidden md:block self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
              Project Name
            </span>
          </Link>
          <div className='flex items-center lg:order-2'>
            <DarkThemeToggle />
            {acc && (
              <p className='hidden md:block text-gray-800 dark:text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5'>
                {acc?.accountId}
              </p>
            )}
            <button
              onClick={acc ? logout : login}
              title={acc ? 'Log Out' : 'Log In'}
              className='ml-2 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>
              {acc ? 'Log Out' : 'Login with NEAR'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
