import React, { useEffect } from "react";
import { useUserAccessStore } from "@/store/userRole";
import { trpc } from "@/utils/trpc";
import { Access } from "@prisma/client";

interface UserAccessContextType {
  setAccessData: (data?: Access | undefined) => void;
}

export const UserAccessContext = React.createContext<UserAccessContextType>({
  setAccessData: () => {},
});

interface UserAccessProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export const UserAccessProvider = ({
  children,
  projectId,
}: UserAccessProviderProps) => {
  const { members } = trpc.useContext();
  const { setAccessData } = useUserAccessStore();

  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        const response = await members.getAccess.fetch({
          projectId,
        });
        setAccessData(response);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAccessData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <UserAccessContext.Provider
      value={{
        setAccessData,
      }}
    >
      {children}
    </UserAccessContext.Provider>
  );
};
