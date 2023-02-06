import { ComponentProps, useCallback, useRef, useState } from "react";
import { parseEnvFile, parseStringEnvContents } from "@/utils/helpers";
import { EyeIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button, Container, InputGroup } from "@/components/theme";
import clsx from "clsx";

export interface KeyPair {
  envKey: string;
  envValue: string;
}

export function EnvironmentVariableEditor() {
  const [envKeys, setEnvKeys] = useState<KeyPair[]>([]);
  const pastingInputIndex = useRef(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    parseEnvFile(file, (pairs) => {
      setEnvKeys([...pairs]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop,
  });

  const handleAddMoreEnvClick = () => {
    setEnvKeys([...(envKeys as KeyPair[]), { envKey: "", envValue: "" }]);
  };
  const handleRemoveEnvPairClick = (index: number) => {
    setEnvKeys(envKeys?.filter((_, i) => i !== index));
  };

  const handlePaste = (event: any) => {
    const pastedEnvKeyValuePairs = parseStringEnvContents(
      event.clipboardData?.getData("text"),
    );

    if (
      !(pastedEnvKeyValuePairs[0].envKey && pastedEnvKeyValuePairs[0].envValue)
    ) {
      return;
    }

    event.preventDefault();
    const envKeysBeforePastingInput = envKeys.slice(
      0,
      pastingInputIndex.current,
    );

    const envKeysAfterPastingInput = envKeys.slice(
      pastingInputIndex.current + 1,
    );
    setEnvKeys([
      ...envKeysBeforePastingInput,
      ...pastedEnvKeyValuePairs,
      ...envKeysAfterPastingInput,
    ]);
  };

  return (
    <Container
      className={`${
        isDragActive ? "border-teal-300" : "border-darker"
      } mt-4 w-full border-2 transition duration-300`}
    >
      {envKeys.length > 0 ? (
        <div className="py-16">
          {envKeys?.map((envPair, index) => (
            <div
              key={new Date().toString() + index}
              className="flex items-center gap-8 px-4"
            >
              <CustomInput
                name={envPair.envKey}
                onFocus={() => (pastingInputIndex.current = index)}
                type="text"
                defaultValue={envPair.envKey}
                className="my-1 w-full font-mono"
                onPaste={handlePaste}
                placeholder="eg. CLIENT_ID"
              />

              <div className="my-1 flex w-full items-center space-x-2">
                <InputGroup
                  full
                  icon={<EyeIcon className="h-4 w-4" />}
                  name={envPair.envValue}
                  type="password"
                  autoComplete="off"
                  defaultValue={envPair.envValue}
                  className="font-mono"
                />

                <Button
                  onClick={() => handleRemoveEnvPairClick(index)}
                  className="rounded"
                  outline
                  small
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-4 px-4">
            <Button small outline onClick={() => handleAddMoreEnvClick()}>
              Add more
            </Button>
          </div>
        </div>
      ) : (
        <div {...getRootProps()} className="py-16 text-center">
          <DragDropIcon className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-xl text-gray-400">
            Drag and drop .env files
          </h3>
          <input
            {...getInputProps()}
            type="file"
            className="hidden"
            accept="env"
          />
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-200 text-lighter">
            You can also{" "}
            <span
              onClick={open}
              className="text-teal-300 transition duration-300 hover:cursor-pointer hover:underline"
            >
              click here
            </span>{" "}
            to import, copy/paste contents in .env file, or create{" "}
            <span
              onClick={handleAddMoreEnvClick}
              className="text-teal-300 transition duration-300 hover:cursor-pointer hover:underline"
            >
              one at a time.
            </span>
          </p>
        </div>
      )}
    </Container>
  );
}

function CustomInput({
  disabled,
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`${
        disabled ? "cursor-not-allowed" : ""
      } ${className} block appearance-none rounded border border-light/50 bg-darker px-3 py-2 placeholder-light shadow-sm ring-1 ring-light/50 focus:border-dark focus:outline-none focus:ring-light sm:text-sm`}
    />
  );
}

function DragDropIcon({ className } : { className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
      <path d="M13 13l9 3l-4 2l-2 4l-3 -9" />
      <path d="M3 3l0 .01" />
      <path d="M7 3l0 .01" />
      <path d="M11 3l0 .01" />
      <path d="M15 3l0 .01" />
      <path d="M3 7l0 .01" />
      <path d="M3 11l0 .01" />
      <path d="M3 15l0 .01" />
    </svg>
  );
}
