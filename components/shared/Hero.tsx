type Props = {
  title: string;
  subtitle: string;
};

const Hero: React.FC<Props> = ({title, subtitle}) => {
  return (
    <section className="relative px-2 py-10 text-center">
      <h1 className="font-display inline bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-5xl">
        {title}
      </h1>
      <h2 className="mt-3 text-lg text-light md:text-xl">
        {subtitle}
      </h2>
    </section>
  );
};

export default Hero;
