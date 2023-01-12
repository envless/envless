import React, { useEffect } from "react";
import { Audit } from "@prisma/client";

interface AuditLogsProps {
  logs: Array<Audit>;
  total: number;
  page: number;
  perPage: number;
  loading: boolean;
  actions: {
    getLogs: (page?: number, perPage?: number) => void;
  };
}

const AuditLogs: React.FC<AuditLogsProps> = ({
  logs,
  total,
  page,
  perPage,
  loading,
  actions,
}) => {
  useEffect(() => {
    actions.getLogs(page, perPage);
  }, [page, perPage]);

  return <div>Audit log</div>;
};

export default AuditLogs;
