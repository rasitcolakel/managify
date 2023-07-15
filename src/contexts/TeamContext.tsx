import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import {
  GetOneResponse,
  INotificationContext,
  useNotification,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  changeOwner,
  deleteTeamMember,
  getMembersOfTeam,
} from "src/services/teams";
import { TeamMember, TeamWithMembers, getMembersOfTeamType } from "src/types";

type TeamContextType = {
  // eslint-disable-next-line no-unused-vars
  onDeleteMember: (teamMember: TeamMember) => void;
  // eslint-disable-next-line no-unused-vars
  onMakeOwner: (teamMember: TeamMember) => void;
  data: GetOneResponse<TeamWithMembers> | undefined;
  queryResult: any;
  t: any;
  open: INotificationContext["open"];
  isLoading: boolean;
  teamMembers: getMembersOfTeamType | null;
};

export const TeamContext = React.createContext<TeamContextType>(
  {} as TeamContextType
);

type TeamContextProviderProps = {
  children: React.ReactNode;
};
const select =
  "*, owner(*), teamMembers(id, user_id, status, profile:profiles!user_id(*))";
export const TeamContextProvider: React.FC<TeamContextProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { id, teamId } = router.query;
  const { data: teamMembers, execute: teamMembersExecute } = useAsyncFunction<
    any,
    getMembersOfTeamType
  >(getMembersOfTeam);

  const { open } = useNotification();
  const t = useTranslate();
  const { queryResult } = useShow<TeamWithMembers>({
    resource: "teams",
    meta: {
      select,
    },
    id: (teamId || id) as string,
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

  const onMakeOwner = async (teamMember: TeamMember) => {
    if (teamMember.status === "invited") {
      return;
    }
    if (data?.data.id && teamMember.user_id) {
      await changeOwner(data?.data.id, teamMember.user_id);
      if (open) {
        open({
          message: t("notifications.success"),
          type: "success",
        });
      }
      queryResult.refetch();
    }
  };
  const record = data?.data;

  useEffect(() => {
    if (!record) {
      return;
    }
    teamMembersExecute(record.id);
  }, [teamMembersExecute, record]);

  return (
    <TeamContext.Provider
      value={{
        onDeleteMember,
        onMakeOwner,
        data,
        queryResult,
        t,
        isLoading,
        open,
        teamMembers,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
