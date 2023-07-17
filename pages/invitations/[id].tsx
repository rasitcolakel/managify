import LoadingOverlay from "@components/common/LoadingOverlay";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useTranslate } from "@refinedev/core";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { authProvider } from "src/authProvider";
import {
  acceptInvitation,
  declineInvitation,
  getInvitationByInvitationCode,
} from "src/services/teams";
import { Invitation } from "src/types";

export default function InvitationPage() {
  const t = useTranslate();
  const router = useRouter();
  const { id } = router.query;

  const { data, execute, loading, error } = useAsyncFunction<any, Invitation>(
    getInvitationByInvitationCode
  );

  const { execute: acceptExecute, loading: acceptLoading } = useAsyncFunction<
    any,
    Invitation
  >(acceptInvitation);

  const { execute: declineExecute, loading: declineLoading } = useAsyncFunction<
    any,
    Invitation
  >(declineInvitation);

  useEffect(() => {
    if (id) {
      execute(id as string);
    }
  }, [id, execute]);

  const handleAccept = async () => {
    if (!data?.id) return;
    await acceptExecute(data?.id);
    await router.push("/teams");
  };

  const handleDecline = async () => {
    if (!data?.id) return;
    await declineExecute(data?.id);
    await router.push("/teams");
  };

  useEffect(() => {
    if (!loading && error) {
      router.push("/404");
    }
  }, [error, loading, router]);

  return (
    <main>
      <Head>
        <title>{t("documentTitle.invitation")}</title>
      </Head>
      <LoadingOverlay loading={loading || error}>
        {!loading && !error && (
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6} lg={4} xl={3}>
              <Paper
                sx={{
                  padding: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5">
                  {t("teams.invitation.title")}
                </Typography>
                <Typography variant="body1" py={3}>
                  {t("teams.invitation.description", {
                    team: data?.team.title,
                  })}
                </Typography>

                <Stack spacing={2} direction="row" justifyContent="center">
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleDecline}
                    disabled={acceptLoading || declineLoading}
                  >
                    {t("buttons.decline")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAccept}
                    disabled={acceptLoading || declineLoading}
                  >
                    {t("buttons.accept")}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </LoadingOverlay>
    </main>
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
