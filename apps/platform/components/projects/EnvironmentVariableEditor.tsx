import { ComponentProps, useCallback, useRef, useState } from "react";
import useSecret from "@/hooks/useSecret";
import { EnvSecret } from "@/types/index";
import { parseEnvContent, parseEnvFile } from "@/utils/envParser";
import clsx from "clsx";
import { Eye, EyeOff, MinusCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { DragDropIcon } from "@/components/icons";
import { Button, Container, TextareaGroup } from "@/components/theme";

export interface EnvVariable {
  envKey: string;
  envValue: string;
  hidden: boolean;
}

export function EnvironmentVariableEditor({ branchId }: { branchId: string }) {
  const [envKeys, setEnvKeys] = useState<EnvVariable[]>([]);
  const pastingInputIndex = useRef(0);

  const { secrets, setSecrets } = useSecret({
    branchId,
  });

  console.log("secrets::: Re-rendering issue 💀💀💀", secrets);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    await parseEnvFile(file, setEnvKeys);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop,
  });

  const handleAddMoreEnvClick = () => {
    setSecrets([
      ...secrets,
      {
        encryptedKey: "",
        encryptedValue: "",
        decryptedKey: "",
        decryptedValue: "",
        hidden: false,
        maskedValue: "",
      },
    ]);
  };

  const handleRemoveEnvPairClick = (index: number) => {
    const updatedSecrets = [...secrets.filter((_, i) => index !== i)];
    setSecrets(updatedSecrets);
  };

  const handleToggleHiddenEnvPairClick = (index: number) => {
    const newEnvKeys = secrets.map((envVariable, i) => {
      const isHidden = () => {
        if (i === index) {
          return !envVariable.hidden;
        }

        return envVariable.hidden;
      };

      return {
        ...envVariable,
        hidden: isHidden(),
      } as EnvSecret;
    });

    setSecrets(newEnvKeys);
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

  const handlePaste = async (event: any) => {
    const content = event.clipboardData.getData("text/plain") as string;
    const pastedEnvKeyValuePairs = await parseEnvContent(content);

    if (
      !(
        pastedEnvKeyValuePairs[0]?.envKey && pastedEnvKeyValuePairs[0]?.envValue
      )
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
      {secrets.length > 0 ? (
        <div className="w-full py-8">
          {secrets.map((envPair, index) => (
            <div
              key={index}
              className="mt-2 grid grid-cols-12 items-center gap-5 space-x-3"
            >
              <div className="col-span-3">
                <CustomInput
                  name={envPair.encryptedKey}
                  onFocus={() => (pastingInputIndex.current = index)}
                  type="text"
                  defaultValue={envPair.decryptedKey}
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
                        <Eye className="text-lighter h-4 w-4" />
                      ) : (
                        <EyeOff className="text-light h-4 w-4" />
                      )
                    }
                    name={envPair.encryptedValue}
                    autoComplete="off"
                    iconActionClick={() =>
                      handleToggleHiddenEnvPairClick(index)
                    }
                    onChange={handleEnvValueChange(index)}
                    value={
                      envPair.hidden
                        ? envPair.maskedValue
                        : envPair.decryptedValue
                    }
                    disabled={false}
                    className={clsx(
                      // envPair.hidden ? "obscure" : "",
                      "inline-block font-mono",
                    )}
                  />

                  <MinusCircle
                    className="text-light hover:text-lighter h-5 w-5 shrink-0 cursor-pointer"
                    onClick={() => handleRemoveEnvPairClick(index)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="float-right mt-4 inline-flex gap-3 ">
            <Button variant="secondary" onClick={() => handleAddMoreEnvClick()}>
              Add more
            </Button>
            <Button onClick={() => handleAddMoreEnvClick()}>
              Save changes
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
            <p className="text-lighter mx-auto mt-1 max-w-md text-sm">
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

interface CustomInputProps {
  reveal?: boolean;
}

function CustomInput({
  disabled,
  className,
  reveal,
  ...props
}: ComponentProps<"input"> & CustomInputProps) {
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
