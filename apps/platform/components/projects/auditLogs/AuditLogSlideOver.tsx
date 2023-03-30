import { Download } from "lucide-react";
import { CopyBlock, dracula } from "react-code-blocks";
import { SlideOver } from "@/components/theme";

type Props = {
  auditLogs: any;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AuditLogSideOver({ open, setOpen, auditLogs }: Props) {
  return (
    <SlideOver
      title="Audit Log Detail"
      size="xl"
      description=""
      open={open}
      setOpen={setOpen}
      submitButtonIcon={
        <Download className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
      }
      submitButtonText="Download CSV"
      onClose={() => setOpen(false)}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="divide divide-dark divide-y-2 py-2 px-4 sm:px-6">
            <dl className="grid grid-cols-2 py-2">
              <dt className="text-sm leading-relaxed">Created By</dt>
              <dd className="text-sm">Chetan Kharel</dd>
            </dl>

            <dl className="grid grid-cols-2 items-center py-2">
              <dt className="text-sm leading-relaxed">Action Performed</dt>
              <dd>
                <span className="bg-lighter text-dark rounded-xl px-2 py-0.5 text-sm font-normal tracking-tight">
                  access.created
                </span>
              </dd>
            </dl>

            <dl className="grid grid-cols-2 py-2">
              <dt className="text-sm leading-relaxed">Project</dt>
              <dd className="text-sm">Untitled X</dd>
            </dl>

            <dl className="grid grid-cols-2 py-2">
              <dt className="text-sm leading-relaxed">Created At</dt>
              <dd className="text-sm">29 July 2022, 9:32 PM</dd>
            </dl>

            <dl className="py-2">
              <dt className="mt-1 text-sm">Data</dt>
              <dd className="scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker mt-3 h-full h-full overflow-y-scroll rounded-md lg:max-h-72">
                <CopyBlock
                  text={JSON.stringify(auditLogs, null, 2)}
                  language="json"
                  theme={dracula}
                />
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
