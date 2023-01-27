import { Shield } from "lucide-react";
import { Container, EmptyState, LoadingIcon } from "@/components/theme";

export default function VerifyAuth() {
  return (
    <Container>
      <div className="mt-16">
        <EmptyState
          icon={<Shield className="m-3 mx-auto h-12 w-12" />}
          title={`Please wait...`}
          subtitle="We are verifying your identity and browser integrity."
        >
          <LoadingIcon className="h-6 w-6" />
        </EmptyState>
      </div>
    </Container>
  );
}
