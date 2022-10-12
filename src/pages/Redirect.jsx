import React, { useEffect } from 'react';

const Reload = () => {
  useEffect(() => {
    // wait for 3 seconds and reload the page
    setTimeout(() => {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }, 1500);
  }, []);

  return (
    <main className='max-w-screen-lg text-center p-6 py-8 md:p-12 md:py-28 mx-auto'>
      <h2 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
        You are being redirected
      </h2>
    </main>
  );
};

export default Reload;
