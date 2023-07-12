import LoadingOverlay from "@components/common/LoadingOverlay";
import styled from "@emotion/styled";
import { Avatar, Chip, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { authProvider } from "src/authProvider";
import { TaskWithAssignee } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";

const StyledDescription = styled.div`
  margin: 1rem;
  p {
    margin: 0;
  }
`;

export default function TaskShow() {
  const router = useRouter();

  const { teamId } = router.query;
  const { queryResult } = useShow<TaskWithAssignee>({
    meta: {
      select:
        "*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles(*)))",
    },
    resource: "tasks",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  useEffect(() => {
    if (!isLoading && !record) {
      router.push(`/teams/${teamId}/tasks`);
    }
  }, [record, isLoading, router, teamId]);
  console.log(record);
  return (
    <LoadingOverlay loading={!record && !isLoading}>
      {record && (
        <Show
          isLoading={!record && !isLoading}
          canDelete={false}
          canEdit={false}
        >
          <Typography variant="h4">{record.title}</Typography>
          {record.description && (
            <StyledDescription
              dangerouslySetInnerHTML={{ __html: record.description }}
            />
          )}

          <Typography
            variant="h5"
            sx={{
              mb: 1,
            }}
          >
            Assignees
          </Typography>
          {record.taskAssignments.length === 0 ? (
            <Typography variant="body1">No assignees</Typography>
          ) : (
            <div>
              {record.taskAssignments.map((assignment) => (
                <Link
                  href={`/profiles/${assignment.assignee.profile.id}`}
                  key={assignment.id}
                >
                  <Chip
                    label={assignment.assignee.profile.full_name}
                    size="medium"
                    avatar={
                      <Avatar
                        sizes="small"
                        sx={{
                          bgcolor: generateRandomColorWithName(
                            assignment.assignee.profile.full_name ?? ""
                          ),
                          height: "1.5em",
                          width: "1.5em",
                        }}
                        key={assignment.assignee.id}
                      >
                        <Typography variant="body2" color="white">
                          {getFirstLettersOfWord(
                            assignment.assignee.profile.full_name ?? ""
                          )}
                        </Typography>
                      </Avatar>
                    }
                  />
                </Link>
              ))}
            </div>
          )}
        </Show>
      )}
    </LoadingOverlay>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/teams")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
