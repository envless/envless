import { Shield } from "lucide-react";
import { EmptyState, LoadingIcon } from "@/components/theme";

const VerifyBrowser = () => {
  return (
    <EmptyState
      icon={<Shield className="m-3 mx-auto h-12 w-12" />}
      title={`Please wait...`}
      subtitle="While we verify your identity and your browser integrity."
    >
      <LoadingIcon className="h-6 w-6" />
    </EmptyState>
  );
};

export default VerifyBrowser;
