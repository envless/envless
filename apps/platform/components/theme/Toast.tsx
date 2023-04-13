import { useEffect, useState } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import clsx from "clsx";

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
        duration={3000}
        open={open}
        onOpenChange={props.onClose}
        className={clsx(
          "fixed inset-x-4 bottom-4 z-50 w-auto rounded shadow-lg md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-full md:max-w-sm",
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
              <ToastPrimitive.Title className="text-lightest text-sm font-medium">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="text-light mt-1 text-sm">
                {subtitle}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Close className="">
                  <span
                    className="bg-darker text-lighter hover:bg-darkest flex justify-center rounded border border-transparent px-4 py-2 text-xs font-medium shadow focus:outline-none focus:ring-2"
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
