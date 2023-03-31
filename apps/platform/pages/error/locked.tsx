import { ShieldClose } from "lucide-react";
import { Container, EmptyState } from "@/components/theme";

const LockedAccount = () => {
  return (
    <Container>
      <div className="mt-16">
        <EmptyState
          icon={<ShieldClose className="m-3 mx-auto h-20 w-20 text-teal-400" />}
          title={`Your account has been locked`}
          subtitle="Please contact support for assistance."
        >
          {""}
        </EmptyState>
      </div>
    </Container>
  );
};

export default LockedAccount;
