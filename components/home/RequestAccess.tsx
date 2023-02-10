import Link from "next/link";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ArrowRight } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Modal } from "@/components/theme";

interface RequestAccessProps {
  source: string;
  button: React.ReactNode;
}

interface RequestAccessModalProps {
  name: string;
  email: string;
  other: string;
}

const RequestAccessModal = (props: RequestAccessProps) => {
  const { source, button } = props;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("Request access");
  const [subtitle, setSubtitle] = useState(
    "Join our growing waitlist and we will reach out to you as soon as possible.",
  );

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const requestMutation = trpc.requestAccess.create.useMutation({
    onSuccess: (data) => {
      setLoading(false);
      setSubmitted(true);
      setTitle("You are now on the waitlist!");
      setSubtitle("");
    },

    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  const createRequestAccess: SubmitHandler<RequestAccessModalProps> = async (
    data,
  ) => {
    const { name, email, other } = data;
    setLoading(true);
    requestMutation.mutate({ name, email, other, source });
    reset();
  };

  return (
    <Modal button={button} title={title} subtitle={subtitle}>
      {submitted ? (
        <div>
          <div className="mt-3 text-center sm:mt-5">
            <div className="mt-2 mb-2">
              <p className="text-md text-light">
                We are contineously building envless in public. Follow us on{" "}
                <Link
                  href="https://twitter.com/envless"
                  target="_blank"
                  className="text-teal-400"
                >
                  Twitter
                </Link>{" "}
                and{" "}
                <Link
                  href="https://github.com/envless/envless"
                  className="text-teal-400"
                  target="_blank"
                >
                  Github
                </Link>{" "}
                to stay updated. We will notify you when we are ready.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(createRequestAccess)}>
          <Input
            name="name"
            label="Name"
            placeholder="Your name"
            required={true}
            full={true}
            register={register}
            errors={errors}
            validationSchema={{
              required: "Your name is required",
            }}
          />

          <Input
            name="email"
            label="Email"
            placeholder="Email address"
            required={true}
            full={true}
            register={register}
            errors={errors}
            validationSchema={{
              required: "Email address is required",
            }}
          />

          <Input
            name="other"
            label="Are you using any secrets management tools? (optional)"
            placeholder="Optional"
            required={false}
            full={true}
            register={register}
          />

          <Button type="submit" full={true} disabled={loading}>
            Request access
            <ArrowRight className="ml-2 h-5" />
          </Button>
        </form>
      )}
    </Modal>
  );
};

export default RequestAccessModal;
