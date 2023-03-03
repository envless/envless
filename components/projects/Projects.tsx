import Link from "next/link";
import { AlertCircle, ArrowRight, GitBranch, Lock, Users } from "lucide-react";
import QRCode from "react-qr-code";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import {
  Button,
  Input,
  Modal,
  Paragraph,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../theme";

const Projects = ({ ...props }) => {
  const { projects } = props;

  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const Card = ({ project }) => {
    const twoFactorAuth = project.projectSettings[0].enforce_2fa_for_all_users;

    return (
      <>
        {twoFactorAuth ? (
          <Link href={`/projects/${project.id}`} className="cursor-pointer">
            <div className="relative w-full rounded-md border-2 border-darker bg-darker p-5 hover:border-teal-300/70">
              {twoFactorAuth && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="absolute right-5 inline-block h-5 w-5 text-lighter" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex space-x-4">
                        <AlertCircle className="h-6 w-6 shrink-0 text-teal-300" />
                        <p className="text-xs">
                        This project requires two-factor authentication
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <h5
                title={project.name}
                className="line-clamp-1 text-base leading-5 text-lightest"
              >
                {project?.name}
              </h5>
              <p className="mt-1 text-xs text-light">
                Created {""}
                <DateTimeAgo date={project.createdAt} />
              </p>
              <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="inline-block">
                    <Users className="inline-block h-5 w-5 text-lighter" />
                    <span className="ml-2 inline-block">
                      {project._count.access}
                    </span>
                  </div>
                  <p className="mt-1 text-light">Members</p>
                </div>

                <div>
                  <div className="inline-block">
                    <GitBranch className="inline-block h-5 w-5 text-lighter" />
                    <span className="ml-2 inline-block">
                      {project._count.branches}
                    </span>
                  </div>
                  <p className="mt-1 text-light">Branches</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Modal
            button={
              <Button secondary={true}>Enable two-factor authentication</Button>
            }
            title="Activate two-factor authentication"
          >
            <Paragraph color="light" size="sm" className="mb-4 text-center">
              Please scan the QR code below with your favorite{" "}
              <Link
                href="https://www.nytimes.com/wirecutter/reviews/best-two-factor-authentication-app/"
                target="_blank"
                rel="noreferrer"
                className="text-lighter"
              >
                two-factor authentication app
              </Link>{" "}
              and then confirm the code below. For mannual setup, you can
              copy/paste this code
            </Paragraph>
            <Paragraph color="light" size="sm" className="m-5 text-center">
              <code
                className="cursor-copy rounded bg-dark py-1 px-2 font-mono text-xs tracking-wider text-lightest"
                onClick={() => {
                  // navigator.clipboard.writeText(`${twoFactor.secret}`);
                }}
              >
                {/* {twoFactor.secret} */}
              </code>
            </Paragraph>

            <div className="flex flex-wrap">
              <div className="mt-4 w-1/2 md:mb-0">
                <QRCode
                  size={175}
                  style={{ height: "175px", maxWidth: "75%", width: "75%" }}
                  // value={twoFactor.keyUri}
                  bgColor={"#000000"}
                  fgColor={"#e4e4e4"}
                />
              </div>

              <div className="w-1/2 md:mb-0">
                <form>
                  <Input
                    type="text"
                    name="code"
                    inputMode="numeric"
                    label="Two-factor auth code"
                    placeholder="xxxxxx"
                    required={true}
                    full={true}
                    // register={register}
                    // errors={errors}
                    help="Enter the six-digit code from your authenticator app."
                    validationSchema={{
                      required: "Two-factor authentication code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Invalid two-factor authentication code",
                      },
                    }}
                  />

                  <div className="float-right">
                    <Button type="submit">
                      Verify and continue
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  };

  return (
    <>
      <div className="relative grid grid-cols-2">
        <h2 className="mb-8 text-2xl">Projects</h2>
        <div className="absolute right-0">
          <CreateProjectModal />
        </div>
      </div>
      <div className="-mx-4 -mb-4 flex flex-wrap md:mb-0">
        {sortedProjects.map((project) => {
          return (
            <div className="mb-8 w-1/2 px-4 lg:w-1/3" key={project.id}>
              <Card project={project} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Projects;
