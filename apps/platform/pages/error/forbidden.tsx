import { ShieldClose } from "lucide-react";
import { Container, EmptyState } from "@/components/theme";

const Unacceptable = () => {
  return (
    <Container>
      <div className="mt-16">
        <EmptyState
          icon={<ShieldClose className="m-3 mx-auto h-12 w-12" />}
          title={`Forbidden error`}
          subtitle={
            process.env.NEXT_PUBLIC_SIGNUP_DISABLED === "true"
              ? "You are not authorized, please contact your admin."
              : "We've detected unusual activity from your account. Please contact support."
          }
        >
          {""}
        </EmptyState>
      </div>
    </Container>
  );
};

export default Unacceptable;
