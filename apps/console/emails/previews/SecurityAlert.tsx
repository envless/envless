import SecurityAlert from "../SecurityAlert";
import BulletedList from "../components/BulletedList";

export function SecurityAlertEmail() {
  return (
    <SecurityAlert
      headline="Security Alert: New Sign-In"
      name="there"
      body={
        <>
          We noticed a new sign-in to your Envless account on a Mac device. If
          this was you, you don’t need to do anything. If not, please reply to
          this email and we’ll help you secure your account.
        </>
      }
      bulletedList={
        <BulletedList
          items={[
            "Date: July 14, 2022 4:26 PM PST",
            "Device: Mac",
            "Browser: Safari",
            "Location: Los Angeles, CA",
            "IP Address: XXX.XX.XXX.XX",
          ]}
        />
      }
    />
  );
}
