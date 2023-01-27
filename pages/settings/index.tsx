import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import SettingsLayout from "@/layouts/Settings";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import TwoFactorModal from "@/components/TwoFactorModal";
import {
  Button,
  Hr,
  Input,
  Paragraph,
  Toast,
  Toggle,
} from "@/components/theme";
import { getBrowser } from "@/lib/getBrowser";
import prisma from "@/lib/prisma";
import { isTwoFactorRequired } from "@/lib/twoFactorAuth";

interface DefaultProps {
  user: User;
}

interface SettingProps {
  name: string;
  email: string;
  marketing: boolean;
  notification: boolean;
}

const AccountSettings: React.FC<DefaultProps> = ({ user }) => {
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({} as SettingProps);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const accountMutation = trpc.account.update.useMutation({
    onSuccess: (_data) => {
      setLoading(false);
      setToast(true);
    },

    onError: (error) => {
      setLoading(false);

      setError("code", {
        type: "custom",
        message: error.message,
      });
    },
  });

  const saveSettings: SubmitHandler<SettingProps> = async (data) => {
    const { name, email, marketing, notification } = data;
    accountMutation.mutate({
      name,
      email,
      marketing,
      notification,
    });

    setLoading(true);
  };

  const submitWithTwoFactor = async (data) => {
    const userAgent = navigator.userAgent;
    const browser = await getBrowser(userAgent);

    // const isRequired = await isTwoFactorRequired(user, browser, visitorId);
    const isRequired = true;

    if (isRequired) {
      setFormData(data);
      setTwoFactorRequired(true);
      return;
    } else {
      setTwoFactorRequired(false);
      handleSubmit(saveSettings(data));
    }
  };

  return (
    <SettingsLayout tab={"account"} user={user}>
      <h3 className="mb-8 text-lg">Account settings</h3>
      <TwoFactorModal
        open={twoFactorRequired}
        onStateChange={setTwoFactorRequired}
        onConfirm={() => {
          setTwoFactorRequired(false);
          handleSubmit(saveSettings(formData));
          reset();
        }}
      />

      <div className="w-full lg:w-3/5">
        <form onSubmit={handleSubmit(submitWithTwoFactor)}>
          <Input
            name="name"
            label="Your name"
            placeholder=""
            defaultValue={user.name || ""}
            required={true}
            register={register}
            errors={errors}
            className="w-full"
            validationSchema={{
              required: "Your name is required",
            }}
          />

          <Input
            name="email"
            label="Email address"
            placeholder=""
            defaultValue={user.email}
            required={false}
            register={register}
            errors={errors}
            className="w-full"
            validationSchema={{
              required: "Email address is required",
            }}
          />

          <div className="mb-6 rounded border-2 border-dark p-3">
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="notification">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <Paragraph color="light" size="sm" className="mr-4">
                  Be notified about activity within your account and projects.
                </Paragraph>
              </label>

              <Toggle
                checked={user.notification}
                name="notification"
                register={register}
                validationSchema={{}}
              />
            </div>

            <Hr />

            <div className="mb-4 flex items-center justify-between pt-3">
              <label htmlFor="marketing">
                <h3 className="text-sm font-semibold">Product updates</h3>
                <Paragraph color="light" size="sm" className="mr-4">
                  Receive product updates and announcements.
                </Paragraph>
              </label>

              <Toggle
                checked={user.marketing}
                name="marketing"
                register={register}
                validationSchema={{}}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            Save account settings
          </Button>
        </form>
      </div>

      <Toast
        title="Account settings"
        subtitle="Successfully updated account settings."
        open={toast}
        onClose={() => setToast(false)}
      />
    </SettingsLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  if (!session || !user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const currentUser = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: user.id,
      },
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(currentUser)),
      },
    };
  }
}

export default AccountSettings;
