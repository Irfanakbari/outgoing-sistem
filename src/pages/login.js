import Head from "next/head";
import {getCookie} from "cookies-next";

export default function Login() {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className={`min-h-screen w-full bg-[#051467de] flex flex-col items-center`}>
                <div className={`w-[35%] h-full bg-white rounded-xl mt-[5cm] py-4`}>
                    <div className={`bg-[#09209f] w-[260px] `}>
                        <h2 className={`text-white text-[1.2em] font-semibold rounded-br rounded-tr py-[10px] pr-[5px] pl-[27px]`}>
                            PT VUTEQ INDONESIA
                        </h2>
                    </div>
                    <div className={`p-5 mt-8`}>
                        <div className="flex items-center border border-gray-300 rounded-lg py-1 px-4">
                            <div className="mr-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </div>
                            <input className="focus:outline-none w-full border-none outline-none focus:border-none" type="text" placeholder="Username" />
                        </div>
                        <br/>
                        <div className="flex items-center border border-gray-300 rounded-lg py-1 px-4">
                            <div className="mr-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </div>
                            <input className="focus:outline-none w-full border-none outline-none focus:border-none" type="text" placeholder="Password" />
                        </div>
                        <div className={`w-full bg-[#09209f] py-4 text-white text-center text-xl mt-7 rounded-b-xl`}>
                            Login
                        </div>
                    </div>
                </div>
                <p className={`text-white mt-8`}>
                    Copyright © 2023
                </p>
            </div>
        </>
    )
}

export const getServerSideProps = ({ req, res }) => {
    const cookie = getCookie('@vuteq-token', { req, res });

    if (cookie) {
        res.writeHead(302, { Location: '/vuteq/home' });
        res.end();
    }

    return { props: {} };
};