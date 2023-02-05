import { ComponentProps, useCallback, useState } from "react";
import { parseEnvFile, parseStringEnvContents } from "@/utils/helpers";
import { useDropzone } from "react-dropzone";
import { HiXMark } from "react-icons/hi2";
import { TbDragDrop } from "react-icons/tb";
import { Button, Container } from "@/components/theme";

export interface KeyPair {
  envKey: string;
  envValue: string;
}

export function EnvironmentVariableEditor() {
  const [envKeys, setEnvKeys] = useState<KeyPair[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    parseEnvFile(file, (pairs) => {
      setEnvKeys([...pairs]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
          // need to handle this use case
          event.preventDefault();
         const pastedEnvKeyValuePairs = parseStringEnvContents(event.clipboardData?.getData("text"))
         setEnvKeys([...envKeys, ...pastedEnvKeyValuePairs]);
  }

  return (
    <Container
      className={`${
        isDragActive ? "border-teal-300" : "border-darker"
      } mt-4 w-full border-2 transition duration-300`}
    >
      {envKeys.length > 0 ? (
        <div className="py-16">
          {envKeys?.map((envPair, index) => (
            <div key={envPair.envKey} className="flex items-center gap-8 px-4">
              <CustomInput
                name={envPair.envKey}
                type="text"
                defaultValue={envPair.envKey}
                className="my-1 shrink-0"
                onPaste={handlePaste}
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
                  small
                >
                  <HiXMark className="w-4 h-4" />
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
          <TbDragDrop className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-xl text-gray-400">
            Drag and drop .env files
          </h3>
          <input {...getInputProps()} type="file" className="hidden" />
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-200 text-lighter">
            You can also click here to import, copy/paste contents in .env file,
            or create{" "}
            <span onClick={handleAddMoreEnvClick} className="text-teal-300 hover:underline hover:cursor-pointer transition duration-300">
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