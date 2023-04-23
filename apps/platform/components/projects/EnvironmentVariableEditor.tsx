import {
  ComponentProps,
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { encryptString } from "@47ng/cloak";
import useSecret from "@/hooks/useSecret";
import { EnvSecret } from "@/types/index";
import {
  attemptToParseCopiedSecrets,
  parseEnvContent,
  parseEnvFile,
} from "@/utils/envParser";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { repeat } from "lodash";
import { Eye, EyeOff, MinusCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { DragDropIcon } from "@/components/icons";
import { Button, Container, TextareaGroup } from "@/components/theme";

export function EnvironmentVariableEditor({ branchId }: { branchId: string }) {
  const pastingInputIndex = useRef(0);

  const { secrets, setSecrets, decryptedProjectKey } = useSecret({
    branchId,
  });

  const { control, setValue, handleSubmit } = useForm<any>();
  const { fields, append, remove, update } = useFieldArray({
    name: "secrets",
    control,
  });
  const saveSecretsMutation = trpc.secrets.saveSecrets.useMutation();

  useEffect(() => {
    if (secrets) {
      setValue("secrets", secrets);
    }
  }, [secrets, setValue]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const pairs = await parseEnvFile(file, decryptedProjectKey);
      setValue("secrets", pairs);
    },
    [setValue, decryptedProjectKey],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop,
  });

  const handleAddMoreEnvClick = () => {
    append({
      id: null,
      encryptedKey: "",
      encryptedValue: "",
      decryptedKey: "",
      decryptedValue: "",
      hidden: false,
      hiddenValue: "",
    });
  };

  const handlePaste = async (event: any) => {
    event.preventDefault();
    const content = event.clipboardData.getData("text/plain") as string;

    const pastedSecrets = await attemptToParseCopiedSecrets(
      content,
      decryptedProjectKey,
    );

    if (pastedSecrets && pastedSecrets.length === 0) {
      return;
    }

    // check for the pastedLength of secrets
    const envKeysBeforePastingInput = fields.slice(
      0,
      pastingInputIndex.current,
    );

    const envKeysAfterPastingInput = fields.slice(
      pastingInputIndex.current + 1,
    );

    remove();

    append([
      ...envKeysBeforePastingInput,
      ...pastedSecrets,
      ...envKeysAfterPastingInput,
    ]);
  };

  const onSubmit = async (data: any) => {
    try {
      const secretsToSave = data.secrets.map((secret: EnvSecret) => {
        return {
          id: secret?.id || null,
          encryptedKey: secret.encryptedKey,
          encryptedValue: secret.encryptedValue,
          branchId,
        };
      });

      await saveSecretsMutation.mutateAsync({ secrets: secretsToSave });
    } catch (err) {}
  };

  return (
    <>
      {fields.length > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full py-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mt-2 grid grid-cols-12 items-center gap-5 space-x-3"
              >
                <div className="col-span-3">
                  <Controller
                    control={control}
                    name={`secrets.${index}.decryptedKey` as const}
                    render={({ field: { value, onChange } }) => (
                      <CustomInput
                        onFocus={() => (pastingInputIndex.current = index)}
                        type="text"
                        className="my-1 w-full font-mono"
                        onPaste={handlePaste}
                        placeholder="eg. CLIENT_ID"
                        value={value}
                        onChange={async (e) => {
                          onChange(e.target.value);

                          const encryptedSecretKey = await encryptString(
                            e.target.value,
                            decryptedProjectKey,
                          );

                          setValue(
                            `secrets.${index}.encryptedKey`,
                            encryptedSecretKey,
                          );
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-span-9">
                  <div className="flex items-center gap-3">
                    <ConditionalInput
                      key={field.id}
                      {...{
                        control,
                        index,
                        field,
                        update,
                        decryptedProjectKey,
                        setValue,
                      }}
                    />

                    <MinusCircle
                      className="text-light hover:text-lighter h-5 w-5 shrink-0 cursor-pointer"
                      onClick={() => remove(index)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="float-right mt-4 inline-flex gap-3 ">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddMoreEnvClick()}
              >
                Add more
              </Button>
              <Button>Save changes</Button>
            </div>
          </div>
        </form>
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
              accept=".env,.yaml,.yml,.json"
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

interface CustomInputProps extends ComponentProps<"input"> {
  reveal?: boolean;
}

const ConditionalInput = ({
  control,
  index,
  field,
  update,
  decryptedProjectKey,
  setValue,
}) => {
  const watchedValue = useWatch({
    name: "secrets",
    control,
  });

  const handleToggleHiddenEnvPairClick = (index: number) => {
    let { hidden, ...others } = watchedValue[index];

    update(index, {
      hidden: hidden ? false : true,
      ...others,
    });
  };

  return (
    <Controller
      control={control}
      name={`secrets.${index}.decryptedValue` as const}
      render={({ field: { onChange, ...rest } }) => (
        <TextareaGroup
          full
          icon={
            watchedValue[index]?.hidden ? (
              <Eye className="text-lighter h-4 w-4" />
            ) : (
              <EyeOff className="text-lighter h-4 w-4" />
            )
          }
          autoComplete="off"
          className={clsx(
            // envPair.hidden ? "obscure" : "",
            "inline-block font-mono",
          )}
          {...{
            ...rest,
            value: watchedValue[index]?.hidden
              ? watchedValue[index]?.hiddenValue || ""
              : rest.value,
          }}
          onChange={async (e) => {
            const plainTextValue = e.target.value;
            onChange(plainTextValue);

            const encryptedSecretValue = await encryptString(
              plainTextValue,
              decryptedProjectKey,
            );
            setValue(`secrets.${index}.encryptedValue`, encryptedSecretValue);
            setValue(
              `secrets.${index}.hiddenValue`,
              repeat("*", plainTextValue.length),
            );
          }}
          disabled={false}
          iconActionClick={() => handleToggleHiddenEnvPairClick(index)}
        />
      )}
    />
  );
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  function CustomInput({ className, disabled, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref as MutableRefObject<HTMLInputElement>}
        disabled={disabled}
        className={clsx(
          "input-primary",
          className,
          disabled ? "cursor-not-allowed" : "",
        )}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    );
  },
);
