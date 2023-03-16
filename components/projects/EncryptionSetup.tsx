import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button } from "@/components/theme";
import BaseEmptyState from "@/components/theme/BaseEmptyState";

const EncryptionSetup = ({ ...props }) => {
  const { encryptionKeys, setEncryptionKeys } = props;

  return (
    <>
      <BaseEmptyState
        icon={
          <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
        }
        title="Setup end to end encryption"
        subtitle="We use a secure, end-to-end encryption setup to ensure your app secrets are protected from unauthorized access. We do not make any security/usability trade-offs. This means only you and your trusted team members will have access to decrypt app secrets."
      >
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => setEncryptionKeys(null)}
            >
              Setup encryption keys
            </Button>
          </div>

          <a
            href="https://envless.dev/docs/encryption"
            target={"_blank"}
            className="mt-2 text-xs text-teal-400 hover:text-teal-600"
          >
            How does encryption work?
          </a>
        </div>
      </BaseEmptyState>
    </>
  );
};

export default EncryptionSetup;
