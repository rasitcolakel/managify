import {
  GetOneResponse,
  INotificationContext,
  useNotification,
  useShow,
  useTranslate,
} from "@refinedev/core";
import React from "react";
import { deleteTeamMember } from "src/services/teams";
import { TeamMember, TeamWithMembers } from "src/types";

type TeamContextType = {
  // eslint-disable-next-line no-unused-vars
  onDeleteMember: (teamMember: TeamMember) => void;
  data: GetOneResponse<TeamWithMembers> | undefined;
  queryResult: any;
  t: any;
  open: INotificationContext["open"];
  isLoading: boolean;
};

export const TeamContext = React.createContext<TeamContextType>(
  {} as TeamContextType
);

type TeamContextProviderProps = {
  children: React.ReactNode;
};
const select =
  "*, owner(*), teamMembers(id, user_id, status, profile:profiles(*))";
export const TeamContextProvider: React.FC<TeamContextProviderProps> = ({
  children,
}) => {
  const { open } = useNotification();
  const t = useTranslate();
  const { queryResult } = useShow<TeamWithMembers>({
    meta: {
      select,
    },
  });
  const { data, isLoading } = queryResult;
  const onDeleteMember = async (teamMember: TeamMember) => {
    await deleteTeamMember(teamMember.id);
    if (open) {
      open({
        message: t("notifications.success"),
        type: "success",
      });
    }
    queryResult.refetch();
  };

  return (
    <TeamContext.Provider
      value={{
        onDeleteMember,
        data,
        queryResult,
        t,
        isLoading,
        open,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
