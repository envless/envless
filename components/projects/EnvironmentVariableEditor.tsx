import { ComponentProps, useCallback, useRef, useState } from "react";
import { parseStringEnvContents } from "@/utils/helpers";
import { parseEnvFile, parseEnvContent } from "@/utils/envParser";
import clsx from "clsx";
import { EyeIcon, EyeOffIcon, XCircleIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { DragDropIcon } from "@/components/icons";
import { Button, Container, TextareaGroup } from "@/components/theme";

export interface EnvVariable {
  envKey: string;
  envValue: string;
  hidden: boolean;
}

export function EnvironmentVariableEditor() {
  const [envKeys, setEnvKeys] = useState<EnvVariable[]>([]);
  const pastingInputIndex = useRef(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    await parseEnvFile(file, setEnvKeys);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop,
  });

  const handleAddMoreEnvClick = () => {
    setEnvKeys([
      ...(envKeys as EnvVariable[]),
      { envKey: "", envValue: "", hidden: true },
    ]);
  };
  const handleRemoveEnvPairClick = (index: number) => {
    setEnvKeys(envKeys?.filter((_, i) => i !== index));
  };

  const handleToggleHiddenEnvPairClick = (index: number) => {
    const newEnvKeys = envKeys.map((envVariable, i) => {
      const isHidden = () => {
        if (i === index) {
          return !envVariable.hidden;
        }

        return envVariable.hidden;
      };

      console.log(envVariable);

      return {
        envKey: envVariable.envKey,
        envValue: envVariable.envValue,
        hidden: isHidden(),
      } as EnvVariable;
    });

    setEnvKeys(newEnvKeys);
  };

  const handleEnvValueChange = (index: number) => (e) => {
    setEnvKeys(
      envKeys.map((envVariable, i) => {
        if (i === index) {
          return {
            ...envVariable,
            envValue: i === index ? e.target.value : envVariable.envValue,
          } as EnvVariable;
        }

        return envVariable;
      }),
    );
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
    <>
      {envKeys.length > 0 ? (
        <div className="w-full py-8">
          {envKeys?.map((envPair, index) => (
            <div
              key={new Date().toString() + index}
              className="mt-2 grid grid-cols-12 items-center gap-5 space-x-3"
            >
              <div className="col-span-3">
                <CustomInput
                  name={envPair.envKey}
                  onFocus={() => (pastingInputIndex.current = index)}
                  type="text"
                  defaultValue={envPair.envKey}
                  className="my-1 w-full font-mono"
                  onPaste={handlePaste}
                  placeholder="eg. CLIENT_ID"
                />
              </div>

              <div className="col-span-9">
                <div className="flex items-center gap-3">
                  <TextareaGroup
                    full
                    icon={
                      envPair.hidden ? (
                        <EyeIcon className="h-4 w-4" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" />
                      )
                    }
                    name={envPair.envValue}
                    type={envPair.hidden ? "password" : "text"}
                    autoComplete="off"
                    iconActionClick={() =>
                      handleToggleHiddenEnvPairClick(index)
                    }
                    onChange={handleEnvValueChange(index)}
                    value={envPair.envValue}
                    className="inline-block font-mono"
                  />

                  <XCircleIcon
                    className="h-5 w-5 shrink-0 cursor-pointer text-light hover:text-lighter"
                    onClick={() => handleRemoveEnvPairClick(index)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 px-4">
            <Button small secondary onClick={() => handleAddMoreEnvClick()}>
              Add more
            </Button>
          </div>
        </div>
      ) : (
        <Container
          className={clsx(
            isDragActive ? "border-teal-300" : "border-darker",
            "mt-10 w-full border-2 transition duration-300",
          )}
        >
          <div {...getRootProps()} className="py-32 text-center">
            <DragDropIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-xl">Drag and drop .env files</h3>
            <input
              {...getInputProps()}
              type="file"
              className="hidden"
              accept="env"
            />
            <p className="mx-auto mt-1 max-w-md text-sm text-lighter">
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
        </Container>
      )}
    </>
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
        "input-primary",
        className,
        disabled ? "cursor-not-allowed" : "",
      )}
    />
  );
}
