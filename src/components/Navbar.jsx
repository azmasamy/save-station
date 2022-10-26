import { DarkThemeToggle } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Navbar = ({ login, logout, acc }) => {
  return (
    <header>
      <nav className='px-4 lg:px-6 py-4 bg-transparent z-10'>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-lg'>
          <Link to='/' className='flex items-center'>
            <svg
              className='w-10 h-10 mr-2 dark:text-white'
              fill='none'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <linearGradient
                  id='gradient'
                  x1='0%'
                  y1='20%'
                  x2='0%'
                  y2='150%'
                  gradientTransform='rotate(-35)'>
                  <stop offset='10%' stopColor='#367FFF' />
                  <stop offset='100%' stopColor='#0047C5' />
                </linearGradient>
              </defs>
              <path
                stroke='url(#gradient)'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
            </svg>
            <span className='hidden md:block self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
              Save Station
            </span>
          </Link>
          <div className='flex items-center lg:order-2'>
            <DarkThemeToggle />
            {acc && (
              <p className='hidden md:block text-gray-800 dark:text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'>
                {acc?.accountId}
              </p>
            )}
            <button
              onClick={acc ? logout : login}
              title={acc ? 'Log Out' : 'Log In'}
              className='ml-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none text-white focus:ring-primary-300 dark:focus:ring-primary-800 font-medium text-sm rounded-lg px-5 py-2.5 text-center'>
              {acc ? 'Log Out' : 'Login with NEAR'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
