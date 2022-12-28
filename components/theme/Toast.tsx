import cx from "classnames";
import { useState, useEffect } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

type Props = {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
};

const Toast = (props: Props) => {
  const { title, subtitle } = props;
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        open={open}
        onOpenChange={props.onClose}
        className={cx(
          "fixed inset-x-4 bottom-4 z-50 w-auto rounded shadow-lg md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm",
          "bg-dark",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-end:animate-toast-swipe-out",
          "translate-x-radix-toast-swipe-move-x",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
        )}
      >
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="radix w-full">
              <ToastPrimitive.Title className="text-sm font-medium text-lightest">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-light">
                {subtitle}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Close className="">
                  <span
                    className="flex justify-center rounded border border-transparent bg-darker px-4 py-2 text-xs font-medium text-lighter shadow hover:bg-darkest focus:outline-none focus:ring-2"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </span>
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

Toast.defaultProps = {
  open: false,
};

export default Toast;
