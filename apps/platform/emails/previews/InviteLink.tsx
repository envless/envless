import InviteLink from "../InviteLink";

export function InviteLinkEmail() {
  return (
    <InviteLink
      headline={
        <>
          Join <b>ProjectX</b> on Envless
        </>
      }
      greeting="Hi there,"
      body={
        <>
          You have been invited to join the project <b>Project X</b> on Envless.
          You will need this passphrase to join the project.
          <br />
          <br />
          <code>
            <pre>some-passphrase-32</pre>
          </code>
        </>
      }
      subText="If you did not request this email you can safely ignore it."
      buttonText={"Join Project X"}
      buttonLink={"https://envless.dev"}
    />
  );
}
