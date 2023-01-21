import Link from "next/link";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import RequestAccess from "@/components/home/RequestAccess";

const Pricing = ({ ...props }) => {
  return (
    <section className="relative overflow-hidden pt-48 pb-36">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="heading text-3xl text-gray-300 sm:text-4xl">
            Pricing
          </h2>

          <RequestAccess
            source="open-source link"
            button={
              <p className="text-base text-light md:mx-48">
                Simple pricing, cancel anytime. Get started with startup plan.
                You can always upgrade later. No credit card required.{" "}
                <span className="cursor-pointer text-teal-300">
                  Forever free for Non-Commercial OpenSource projects.
                </span>
              </p>
            }
          />
        </div>

        <div className="-m-7 flex flex-wrap">
          {/* Startup */}
          <div className="w-full p-7 md:w-1/3">
            <div className="h-full rounded border border-darkest bg-dark p-8">
              <div className="mb-7 flex flex-wrap justify-between pb-2">
                <div className="w-full xl:w-auto">
                  <h3 className="text-2xl text-lightest">Startup</h3>
                </div>
              </div>
              <ul className="mb-8">
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Upto 5 projects</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited branches</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>End to end encryption</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Two-factor authentication</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Deploy anywhere</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Upto 5 team members</p>
                </li>
                <li className="font-heading flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>1 Month of audit logs</p>
                </li>
              </ul>

              <RequestAccess
                source="startup plan button"
                button={
                  <button className="font-heading tracking-px group relative mb-3 w-full rounded text-center text-xs font-semibold uppercase text-gray-900 md:w-auto">
                    <div className="rounded bg-lightest py-4 px-9 hover:bg-gray-300 ">
                      <p className="relative z-10 ">Forever free</p>
                    </div>
                  </button>
                }
              />
            </div>
          </div>

          {/* Growth */}
          <div className="w-full p-7 md:w-1/3">
            <div className="h-full rounded p-0.5">
              <div className="rounded bg-lightest p-8">
                <div className="mb-7 flex flex-wrap justify-between pb-2">
                  <div className="w-full xl:w-auto">
                    <h3 className="text-2xl text-gray-900">Growth</h3>
                  </div>
                </div>
                <ul className="mb-8">
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Upto 10 projects</p>
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
                    <p>Two-factor authentication</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Deploy anywhere</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>Upto 50 team members</p>
                  </li>
                  <li className="font-heading mb-4 flex items-center text-base font-medium text-gray-900">
                    <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                    <p>6 months of audit logs</p>
                  </li>
                </ul>

                <RequestAccess
                  source="growth plan button"
                  button={
                    <button className="font-heading tracking-px group relative mb-3 w-full overflow-hidden rounded text-center text-xs font-semibold uppercase text-lighter md:w-auto">
                      <div className="overflow-hidden rounded bg-darkest py-4 px-9 hover:bg-dark">
                        <p className="relative z-10">$5 per user per month</p>
                      </div>
                    </button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Enterprise */}
          <div className="w-full p-7 md:w-1/3">
            <div className="h-full rounded border border-darkest bg-dark p-8">
              <div className="mb-7 flex flex-wrap justify-between pb-2">
                <div className="w-full xl:w-auto">
                  <h3 className="text-2xl text-lightest">Enterprise</h3>
                </div>
              </div>
              <ul className="mb-8">
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited projects</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited branches</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>End to end encryption</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Two-factor authentication</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Deploy anywhere</p>
                </li>
                <li className="font-heading mb-4 flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited team members</p>
                </li>
                <li className="font-heading flex items-center text-base font-medium text-light">
                  <HiOutlineBadgeCheck className="mr-2 h-6 w-6 text-teal-400" />
                  <p>Unlimited audit logs</p>
                </li>
              </ul>

              <RequestAccess
                source="enterprise plan button"
                button={
                  <button className="font-heading tracking-px group relative mb-3 w-full rounded text-center text-xs font-semibold uppercase text-gray-900 md:w-auto">
                    <div className="rounded bg-lightest py-4 px-9 hover:bg-gray-300 ">
                      <p className="relative z-10 ">$10 per user per month</p>
                    </div>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
