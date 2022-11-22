// import img from 'next/image'

const Highlights = ({ ...props }) => {
  return (
    <section className="relative pt-48 pb-48 overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        <h2 className="mb-20 text-6xl font-medium text-center text-gray-200 sm:text-5xl">Secure your app and boost your productivity</h2>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 md:relative md:top-12">
            <div className="h-full transition duration-1000 ease-out transform p-9 hover:-translate-y-3 bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl">
              <p className="mb-4 text-base text-white font-heading text-opacity-70">Advance reports</p>
              <h3 className="mb-20 text-3xl font-bold text-white font-heading">Daily analytics help you to understand business growth.</h3>
              <div>
                <div className="pr-7">
                  <div className="relative z-10 p-5 text-center bg-white rounded-10 shadow-3xl">
                    <p className="mb-3 text-3xl font-bold text-black">162.9k</p>
                    <p className="mb-3 text-xs font-bold text-black">Last 7 Days Website Visits</p>
                    <p className="text-xs text-gray-500">10% Increase from Last Week</p>
                  </div>
                </div>
                <div className="-mt-14 pl-7">
                  <div className="p-5 text-center bg-white opacity-30 rounded-10 shadow-3xl">
                    <p className="mb-3 text-3xl font-bold text-black">162.9k</p>
                    <p className="mb-3 text-xs font-bold text-black">Last 7 Days Website Visits</p>
                    <p className="text-xs text-gray-500">10% Increase from Last Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-5 md:w-1/2">
            <div className="flex flex-col justify-between h-full overflow-hidden transition duration-1000 ease-out transform hover:-translate-y-3 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-2xl">
              <div className="pb-0 p-9">
                <p className="mb-4 text-base text-white font-heading text-opacity-70">Unlimited entertainment</p>
                <h3 className="mb-5 text-3xl font-bold text-white font-heading">Give a break. Make employee happy in the office.</h3>
              </div>
              <img className="w-full mx-auto" src="https://shuffle.dev/gradia-assets/images/features/headphones.png" alt=""/>
            </div>
          </div>
          <div className="w-full pt-5 md:w-1/2 md:relative md:top-12">
            <div className="h-full transition duration-1000 ease-out transform p-9 hover:-translate-y-3 bg-gradient-to-r bg-gradient-to-b from-sky-400 to-sky-200 rounded-2xl">
              <p className="mb-4 text-base text-white font-heading text-opacity-70">Fastest growth</p>
              <h3 className="mb-20 text-3xl font-bold text-white font-heading">Track results. Share with anyone without taking the hassle.</h3>
              <img className="mx-auto" src="https://shuffle.dev/gradia-assets/images/features/card.png" alt=""/>
            </div>
          </div>
          <div className="w-full p-5 md:w-1/2">
            <div className="h-full pb-0 transition duration-1000 ease-out transform p-9 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 hover:-translate-y-3 rounded-2xl">
              <p className="mb-4 text-base text-white font-heading text-opacity-70">Customer review</p>
              <h3 className="mb-20 text-3xl font-bold text-white font-heading">20k+ experts love our products &amp; support.</h3>
              <img className="mx-auto" src="https://shuffle.dev/gradia-assets/images/features/comments.png" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Highlights;