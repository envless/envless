type Props = {};

const Hero: React.FC<Props> = () => {
  return (
    <section className="relative px-2 py-10 text-center">
      <h1 className="font-display inline bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text text-3xl tracking-tight text-transparent md:text-5xl">
        Blog
      </h1>
      <h2 className="mt-3 text-lg text-light-50 md:text-xl">
        Tutorials and articles about Envless, security, and more.
      </h2>
    </section>
  );
};

export default Hero;
