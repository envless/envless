import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ArrowRight } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Paragraph } from "@/components/theme";

interface RequestAccessProps {
}

interface SignupProps {
  name: string;
  email: string;
  other: string;
}

const Signup = (props: RequestAccessProps) => {
  const source = "Signup page"
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

  const createRequestAccess: SubmitHandler<SignupProps> = async (
    data,
  ) => {
    const { name, email, other } = data;
    setLoading(true);
    requestMutation.mutate({ name, email, other, source });
    reset();
  };

  return (
    <div className="flex h-screen flex-col justify-center px-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          height={100}
          width={100}
          src="/logo.png"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl">
          Request access
        </h2>

        <p className="mt-2 text-center text-sm text-light">
          Join our growing waitlist and we will reach out to you as soon as possible.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="px-2 py-8 sm:px-8">
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

              <Paragraph
                color="lighter"
                size="xs"
                className="mt-2 text-center text-[12px]"
              >
                We will never spam you with bs.
              </Paragraph>
            </form>
          )}
        </div>
      </div>  
    </div>
  );
};

export default Signup;
