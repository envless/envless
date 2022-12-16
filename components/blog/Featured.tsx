import Zoom from "react-medium-image-zoom";

type Props = {
  title: string;
  date: string;
  image: string;
};

const Featured: React.FC<Props> = ({ title, date, image }) => {
  return (
    <div className="grid gap-10 lg:mt-10 lg:gap-12">
      <div className="group grid cursor-pointer gap-3 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-video overflow-hidden rounded-md transition-all">
          <Zoom>
            <img
              alt={title}
              sizes="80vw"
              src={image}
              decoding="async"
              data-nimg="fill"
              className="object-cover transition-all"
            />
          </Zoom>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-3 text-light">
            <time className="text-sm" dateTime="2022-10-21T15:48:00.000Z">
              {date}
            </time>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-normal text-white lg:text-3xl">
            <span className=" bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]">
              {title}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;
