const Footer = () => {
  return (
    <footer className='font-medium bg-transparent p-4 sm:p-6 xl:p-8'>
      <p className='text-sm text-center text-black opacity-80 dark:text-white'>
        &copy;
        {new Date().getFullYear()} - Save Station. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
