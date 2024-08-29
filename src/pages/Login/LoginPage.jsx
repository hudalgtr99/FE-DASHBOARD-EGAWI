import { FaLock, FaRegUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className='bg-gradient-to-b from-orange-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700'>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/coming-soon-object1.png" alt="object1" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2 dark:opacity-50" />
                <img src="/assets/coming-soon-object3.png" alt="object3" className="absolute right-0 top-0 h-[300px] dark:opacity-50" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg lg:dark:bg-gray-900 dark:bg-gray-800 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-gradient-to-br from-pink-600 to-blue-600 p-5 dark:from-gray-800 dark:to-gray-700 lg:inline-flex lg:max-w-[835px] xl:-ms-28 xl:skew-x-[14deg]">
                        <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent -right-10 xl:w-16 xl:-right-20 dark:from-gray-600/10"></div>
                        <div className="xl:-skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/LogoQNN.png" alt="Logo" className="w-full dark:opacity-75" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/login.svg" alt="Cover" className="w-full dark:opacity-75" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 py-16 lg:pb-56 lg:py-0 sm:px-6 lg:max-w-[667px]">
                        <div className="w-full max-w-[440px]">
                            <div className="mb-10 max-[1024px]:text-center">
                                <h1 className="text-3xl mb-2 font-bold uppercase leading-snug text-blue-600 dark:text-blue-400 md:text-4xl lg:block hidden">Login</h1>
                                <h1 className="text-lg mb-2 font-bold uppercase leading-snug text-blue-600 dark:text-blue-400 md:text-xl lg:hidden block">PT QUEEN NETWORK NUSANTARA</h1>
                                <p className="text-base font-bold leading-normal text-gray-400 dark:text-gray-300">Masukan Username dan Password</p>
                            </div>
                            <form className="space-y-5 dark:text-white">
                                <div>
                                    <label htmlFor="Username" className='font-bold text-gray-700 dark:text-gray-300'>Username</label>
                                    <div className="relative">
                                        <input id="Username" type="username" placeholder="Enter Username" className="w-full px-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:border-gray-600"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <FaRegUser />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password" className='font-bold text-gray-700 dark:text-gray-300'>Password</label>
                                    <div className="relative">
                                        <input id="Password" type="password" placeholder="Enter Password" className="w-full px-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:border-gray-600"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <FaLock />
                                        </span>
                                    </div>
                                </div>
                                <div></div>
                                <button type="submit" className="w-full border-0 uppercase bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-gradient-to-l transition-shadow dark:from-gray-700 dark:to-gray-600"
                                >
                                    Login
                                </button>
                            </form>
                            <p className="absolute bottom-2 left-48 hidden xl:block w-full text-center dark:text-white">© {new Date().getFullYear()}. QUEEN All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
