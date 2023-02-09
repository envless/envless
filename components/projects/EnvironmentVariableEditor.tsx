import { ComponentProps, useCallback, useRef, useState } from "react";
import { parseEnvFile, parseStringEnvContents } from "@/utils/helpers";
import clsx from "clsx";
import { EyeIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { DragDropIcon } from "@/components/icons";
import { Button, Container, InputGroup } from "@/components/theme";

export interface EnvVariable {
  envKey: string;
  envValue: string;
}

export function EnvironmentVariableEditor() {
  const [envKeys, setEnvKeys] = useState<EnvVariable[]>([]);
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
    setEnvKeys([...(envKeys as EnvVariable[]), { envKey: "", envValue: "" }]);
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
      className={clsx(
        isDragActive ? "border-teal-300" : "border-darker",
        "mt-4 w-full border-2 transition duration-300",
      )}
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

interface InputProps {
  reveal?: boolean;
}

function CustomInput({
  disabled,
  className,
  reveal,
  ...props
}: ComponentProps<"input"> & InputProps) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={clsx(
        "block appearance-none rounded border border-light/50 bg-darker px-3 py-2 placeholder-light shadow-sm ring-1 ring-light/50 focus:border-dark focus:outline-none focus:ring-light sm:text-sm",
        className,
        disabled ? "cursor-not-allowed" : "",
      )}
    />
  );
}
