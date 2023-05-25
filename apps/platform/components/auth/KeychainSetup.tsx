import { UserType } from "@/types/resources";

type Props = {
  setPage: any;
  user: UserType;
  csrfToken: string;
};

const KeychainSetup = ({ user, setPage, csrfToken }: Props) => {
  return <div className="keychain-setup">Keychain setup</div>;
};

export default KeychainSetup;
