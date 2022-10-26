import { Link } from 'react-router-dom';
import passImg from '../imgs/password.png';

const Home = () => {
  return (
    <main className='max-w-screen-lg px-4 py-8 md:pt-24 md:pb-16 mx-auto relative'>
      <div className='w-[500px] h-[500px] absolute bg-primary-600 bg-opacity-25 rounded-full overflow-hidden blur-3xl -right-10 top-16 z-[1]'></div>
      <div className='flex flex-col-reverse gap-4 md:flex-row justify-between items-center mb-36'>
        <div className='space-y-5'>
          <h2 className='text-5xl font-bold max-w-[18ch] leading-tight'>
            {/* Lorem ipsum dolor{' '} */}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700'>
              Save Station
            </span>{' '}
            sit amet consectetur.
          </h2>
          <p className='font-light opacity-70 max-w-[55ch] pb-3'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
            perferendis vel beatae error a. Qui reprehenderit perferendis amet
            quam optio.
          </p>
          <div className='space-x-4'>
            <Link
              to='/profile'
              className='inline-block text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg px-5 py-2.5 text-center'>
              Get Started
            </Link>
            <Link
              to='/recover'
              className='relative inline-flex items-center justify-center p-[3px] mb-2 mr-2 overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'>
              <span className='relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                Recover Account
              </span>
            </Link>
          </div>
        </div>
        <img
          src={passImg}
          alt='password lock'
          className='bounce-animation w-96 aspect-square z-[2]'
        />
      </div>
      <p className='opacity-70'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum quis
        harum voluptatum? Rerum, veniam ullam? Fugiat nulla rem non cum beatae
        qui ducimus accusamus quidem odit ab, officia magnam nemo voluptate
        tenetur. Earum exercitationem impedit nostrum voluptates inventore
        quidem repellat fugiat veritatis. Nulla fugit, doloremque itaque ducimus
        eum nihil excepturi maiores sapiente doloribus eveniet architecto quasi
        sequi facilis aliquid expedita quisquam optio vel obcaecati dolorum quos
        mollitia velit accusamus. Modi repudiandae obcaecati pariatur nesciunt
        ratione, iure quo. Officia vel alias ut, non repellat voluptates
        doloremque animi deleniti cum eos. Velit blanditiis voluptatibus
        molestias quasi autem architecto et amet quisquam deserunt expedita
        suscipit laudantium animi incidunt reprehenderit, voluptatum provident
        minima enim quos? Voluptas illum perspiciatis animi ab culpa soluta cum
        vitae a alias molestias facere minima cupiditate, impedit veniam minus
        consequuntur maxime voluptatibus praesentium repellat ut? Doloremque
        dolorem, velit consectetur est officia voluptatum, tenetur ab, ratione
        cumque repellendus similique. Debitis explicabo quibusdam voluptatibus
        incidunt eius. Autem, totam. Doloremque officia pariatur expedita
        eveniet fugit nemo aspernatur mollitia nesciunt voluptatum, error optio
        unde ad inventore aperiam itaque excepturi obcaecati consequatur amet,
        assumenda molestiae. Ex perferendis voluptas quibusdam odit fugiat
        officia voluptates blanditiis corrupti recusandae deleniti reiciendis,
        ut nostrum, eaque magni voluptatum eligendi explicabo.
      </p>
    </main>
    // <main className='max-w-screen-lg text-center p-6 py-8 md:p-12 md:py-28 mx-auto'>
    //   {acc ? (
    //     <div className='space-y-4'>
    //       <h2 className='mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
    //         Save Station
    //       </h2>
    //       <hr className='mb-8 dark:opacity-20' />
    //       <div>Welcome back!</div>
    //       <h2 className='w-fit mx-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>
    //         {acc.accountId}
    //       </h2>
    //       <button
    //         onClick={deployRecoveryKeyContract}
    //         title='Deploy Account Recovery Contract'
    //         className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>
    //         Deploy Account Recovery Contract
    //       </button>
    //     </div>
    //   ) : (
    //     <div className='space-y-4'>
    //       <div>You are not logged in, please login to continue</div>
    //       <button
    //         onClick={login}
    //         title='Log In'
    //         className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>
    //         Login with NEAR
    //       </button>
    //     </div>
    //   )}
    // </main>
  );
};

export default Home;
