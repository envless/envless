import { formatDateTime } from "@/utils/helpers";
import { CopyBlock, atomOneDark } from "react-code-blocks";
import { SlideOver } from "@/components/theme";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  auditLogDetail: any;
};

export default function AuditLogSideOver({
  open,
  setOpen,
  auditLogDetail,
}: Props) {
  return (
    <SlideOver
      title="Audit Log Detail"
      size="xl"
      description=""
      open={open}
      setOpen={setOpen}
      onClose={() => setOpen(false)}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="divide divide-dark divide-y-2 px-4 py-2 sm:px-6">
            <dl className="grid grid-cols-2 py-2">
              <dt className="text-sm leading-relaxed">Created by</dt>
              <dd className="text-sm">
                {auditLogDetail?.createdBy.name ||
                  auditLogDetail?.createdBy.email}
              </dd>
            </dl>

            <dl className="grid grid-cols-2 items-center py-2">
              <dt className="text-sm leading-relaxed">Action</dt>
              <dd>
                <span className="bg-lighter text-dark rounded-xl px-2 py-0.5 text-sm font-normal tracking-tight">
                  {auditLogDetail?.action}
                </span>
              </dd>
            </dl>

            <dl className="grid grid-cols-2 py-2">
              <dt className="text-sm leading-relaxed">Timestamp</dt>
              <dd className="text-sm">
                {formatDateTime(auditLogDetail?.createdAt)}
              </dd>
            </dl>

            <dl className="py-2">
              <dt className="mt-1 text-sm">Data</dt>
              <dd className="scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker mt-3 h-full overflow-y-scroll rounded-md lg:max-h-72">
                <CopyBlock
                  text={JSON.stringify(auditLogDetail?.data, null, 2)}
                  language="json"
                  theme={atomOneDark}
                />
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
