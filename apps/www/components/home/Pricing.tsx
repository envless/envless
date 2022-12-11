import Link from "next/link";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const Pricing = ({ ...props }) => {
  return (
    <section className="relative overflow-hidden pt-48 pb-36">
      <div className="container relative z-10 mx-auto px-4">
        <div className="-m-7 flex flex-wrap">
          <div className="w-full p-7 md:w-1/3">
            <div className="h-full">
              <h2 className="font-heading mb-5 text-3xl font-normal text-gray-300 sm:text-4xl">
                Pricing
              </h2>
              <p className="text-light text-base">
                Simple pricing, cancel anytime. Get started with personal plan.
                You can always upgrade later. No credit card required.{" "}
                <span className="text-teal-200">
                  Free for OpenSource projects.
                </span>
              </p>
            </div>
          </div>

          <div className="w-full p-7 md:w-1/3">
            <div className="border-darkest bg-dark h-full rounded border p-8">
              <div className="mb-7 flex flex-wrap justify-between pb-2">
                <div className="w-full xl:w-auto">
                  <h3 className="text-lightest text-2xl font-normal">
                    Personal
                  </h3>
                </div>
              </div>
              <ul className="mb-8">
                <li className="font-heading text-light mb-4 flex items-center text-base font-medium">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited projects</p>
                </li>
                <li className="font-heading text-light mb-4 flex items-center text-base font-medium">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited branches</p>
                </li>
                <li className="font-heading text-light mb-4 flex items-center text-base font-medium">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>End to end encryption</p>
                </li>
                <li className="font-heading text-light flex items-center text-base font-medium">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Deploy anywhere</p>
                </li>
              </ul>
              <Link
                href="/auth"
                target="_self"
                className="font-heading tracking-px group relative mb-3 w-full rounded text-center text-xs font-semibold uppercase text-gray-900 md:w-auto"
              >
                <div className="bg-lightest rounded py-4 px-9 hover:bg-gray-300 ">
                  <p className="relative z-10 ">Forever free</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full p-7 md:w-1/3">
            <div className="h-full rounded p-0.5">
              <div className="bg-lightest rounded p-8">
                <div className="mb-7 flex flex-wrap justify-between pb-2">
                  <div className="w-full xl:w-auto">
                    <h3 className="text-2xl font-normal text-gray-900">Team</h3>
                  </div>
                </div>
                <ul className="mb-8">
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Unlimited projects</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Unlimited branches</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>End to end encryption</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Deploy anywhere</p>
                  </li>
                </ul>
                <Link
                  href="/auth"
                  target="_self"
                  className="font-heading tracking-px text-light group relative mb-3 w-full overflow-hidden rounded text-center text-xs font-semibold uppercase md:w-auto"
                >
                  <div className="bg-darkest hover:bg-dark overflow-hidden rounded py-4 px-9">
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
