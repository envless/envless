const Container = ({ ...props }) => {
  const { children } = props;

  return (
    <section className="mx-auto max-w-screen-xl px-10 xl:px-16">
      {children}
    </section>
  );
};

export default Container;
