import Link from "next/link";
import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { HiXMark } from "react-icons/hi2";
import { TbDragDrop } from "react-icons/tb";
import { Button, Container } from "@/components/theme";

export interface KeyPair {
  envKey: string;
  envValue: string;
}

interface Props {
  envKeys: KeyPair[];
  setEnvKeys: Dispatch<SetStateAction<KeyPair[]>>;
}

export function EnvironmentVariableEditor({
  envKeys,
  setEnvKeys,
}: Props) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = (event) => {
      let keys = ((event.target?.result as string) || "").match(
        /\b(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)/gm,
      ) ?? [""];

      const keyValuePairs: KeyPair[] = [];

      keys.map((key) => {
        const keyPair = key.split("=");
        keyValuePairs.push({ envKey: keyPair[0], envValue: keyPair[1] });
      });

      setEnvKeys(keyValuePairs);
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAddMoreEnvClick = () => {
    setEnvKeys([...envKeys, { envKey: "", envValue: "" }]);
  };
  const handleRemoveEnvPairClick = (index: number) => {
    setEnvKeys([...(envKeys.filter((_, i) => i !== index) as KeyPair[])]);
  };
  return (
    <Container
      className={`${
        isDragActive ? "border-teal-300" : "border-darker"
      } mt-4 w-full border-2 transition duration-300`}
    >
      {envKeys && envKeys?.length > 0 ? (
        <div className="py-16">
          {envKeys.map((envPair, index) => (
            <form>
              <div key={index} className="flex items-center gap-8 px-4">
                <CustomInput
                  name={envPair.envKey}
                  type="text"
                  defaultValue={envPair.envKey}
                  className="my-1 shrink-0"
                />

                <div className="my-1 flex flex-1 items-center space-x-2">
                  <CustomInput
                    name={envPair.envValue}
                    type="text"
                    defaultValue={envPair.envValue}
                    className="w-full"
                  />
                  <Button
                    onClick={() => handleRemoveEnvPairClick(index)}
                    className="rounded-full"
                    outline
                  >
                    <HiXMark />
                  </Button>
                </div>
              </div>
            </form>
          ))}

          <div className="mt-4 px-4">
            <Button small outline onClick={() => handleAddMoreEnvClick()}>
              Add more
            </Button>
          </div>
        </div>
      ) : (
        <div {...getRootProps()} className="py-16 text-center">
          <TbDragDrop className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-xl text-gray-400">
            Drag and drop .env files
          </h3>

          <input {...getInputProps()} type="file" className="hidden" />

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-200 text-lighter">
            You can also click here to import, copy/paste contents in .env file,
            or create{" "}
            <Link href="/" className="text-teal-300">
              one at a time.
            </Link>
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
