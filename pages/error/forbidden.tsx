import { ShieldClose } from "lucide-react";
import { Container, EmptyState } from "@/components/theme";

const Unacceptable = () => {
  return (
    <Container>
      <div className="mt-16">
        <EmptyState
          icon={<ShieldClose className="m-3 mx-auto h-12 w-12" />}
          title={`Forbidden error`}
          subtitle="We've detected unusual activity from your account. Please contact support."
        ></EmptyState>
      </div>
    </Container>
  );
};

export default Unacceptable;
