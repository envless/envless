import Link from 'next/link'
import { HiOutlineBadgeCheck } from 'react-icons/hi'

const Pricing = ({ ...props }) => {
  return (
    <section className="relative pt-48 overflow-hidden bg-black pb-36">
      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-wrap -m-7">
          <div className="w-full md:w-1/3 p-7">
            <div className="h-full">
              <h2 className="mb-5 text-3xl font-normal text-gray-300 font-heading sm:text-4xl">
                Pricing
              </h2>
              <p className="text-base text-gray-400">
                Simple pricing, cancel anytime. Get started with personal plan. You can always upgrade later. No credit card required. <span className="text-teal-200">Free for OpenSource projects.</span>
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-7">
            <div className="bg-[#111] h-full p-8 border border-gray-900 rounded">
              <div className="flex flex-wrap justify-between pb-2 mb-7">
                <div className="w-full xl:w-auto">
                  <h3 className="text-2xl font-normal text-white">
                    Personal
                  </h3>
                </div>
              </div>
              <ul className="mb-8">
                <li className="flex items-center mb-4 text-base font-medium text-white font-heading">
                  <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                  <p>Unlimited projects</p>
                </li>
                <li className="flex items-center mb-4 text-base font-medium text-white font-heading">
                  <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                  <p>Unlimited branches</p>
                </li>
                <li className="flex items-center mb-4 text-base font-medium text-white font-heading">
                  <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                  <p>End to end encryption</p>
                </li>
                <li className="flex items-center text-base font-medium text-white font-heading">
                  <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                  <p>Deploy anywhere</p>
                </li>
              </ul>
              <Link href="/auth" className="relative w-full mb-3 text-xs font-semibold text-center text-gray-900 uppercase rounded group md:w-auto font-heading tracking-px">
                <div className="py-4 bg-white rounded hover:bg-gray-300 px-9 ">
                  <p className="relative z-10 ">Forever free</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-7">
            <div className="h-full p-0.5 rounded">
              <div className="p-8 bg-white rounded">
                <div className="flex flex-wrap justify-between pb-2 mb-7">
                  <div className="w-full xl:w-auto">
                    <h3 className="text-2xl font-normal text-gray-900">Team</h3>
                  </div>
                </div>
                <ul className="mb-8">
                  <li className="flex items-center mb-4 text-base font-medium text-gray-900 font-heading">
                    <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                    <p>Unlimited projects</p>
                  </li>
                  <li className="flex items-center mb-4 text-base font-medium text-gray-900 font-heading">
                    <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                    <p>Unlimited branches</p>
                  </li>
                  <li className="flex items-center mb-4 text-base font-medium text-gray-900 font-heading">
                    <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                    <p>End to end encryption</p>
                  </li>
                  <li className="flex items-center mb-4 text-base font-medium text-gray-900 font-heading">
                    <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-teal-400" />
                    <p>Deploy anywhere</p>
                  </li>
                </ul>
                <Link href="/auth" className="relative w-full mb-3 overflow-hidden text-xs font-semibold text-center text-white uppercase rounded group md:w-auto font-heading tracking-px">
                  <div className="py-4 overflow-hidden bg-black hover:bg-[#222] rounded px-9">
                    <p className="relative z-10">$5 per month per user</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
