import Link from "next/link";
import { getSession } from "next-auth/react";

type Props = {
  user: any;
};

const ConsoleHome: React.FC<Props> = ({ user }) => {
  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-[#111] px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                <svg
                  className="h-6 w-6 text-teal-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-2xl font-medium leading-6" id="modal-title">
                  Welcome to .envless
                </h3>
                <div className="mt-2 mb-2">
                  <p className="text-sm text-light">
                    We are contineously building envless in public. Follow us on{" "}
                    <Link
                      href="https://twitter.com/envless"
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-400"
                    >
                      Twitter
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="https://github.com/envless/envless"
                      className="text-teal-400"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Github
                    </Link>{" "}
                    to stay updated. We will notify you when we are ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;

  return {
    props: { user },
  };
}

export default ConsoleHome;
