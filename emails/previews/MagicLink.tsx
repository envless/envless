import MagicLink from "../MagicLink";

export function MagicLinkEmail() {
  return (
    <MagicLink
      headline="Login to Envless"
      greeting="Hi there,"
      body={
        <>
          We have received a login attempt. If this was you, please click the button below to complete the login process.
        </>
      }
      subText="If you did not request this email you can safely ignore it."
      buttonText={"Login to Envless"}
      buttonLink={"https://envless.dev"}
    />
  );
}
