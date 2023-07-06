import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MuiEditInferencer } from "@refinedev/inferencer/mui";
import { useTranslate } from "@refinedev/core";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { getTeamsOwnedByAuthUser } from "src/services/teams";
import { useEffect } from "react";
import LoadingOverlay from "@components/common/LoadingOverlay";
import { useRouter } from "next/router";
export default function TeamEdit() {
  const t = useTranslate();
  const router = useRouter();

  const id = router.query.id as string;

  const {
    data,
    execute,
    loading: isLoading,
  } = useAsyncFunction<typeof getTeamsOwnedByAuthUser, number[]>(
    getTeamsOwnedByAuthUser
  );

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const hasTeam = data?.some((team) => team === Number(id));
    if (!hasTeam) {
      // do not push to router if user does not own the team
      router.push("/teams");
    }
  }, [data, id, router]);
  return (
    <LoadingOverlay loading={isLoading}>
      <MuiEditInferencer
        hideCodeViewerInProduction
        resource="teams"
        fieldTransformer={(field) => {
          if (field.key === "title" || field.key === "description") {
            return {
              key: field.key,
              type: "text",
              relation: false,
              multiple: false,
              label: t("teams.fields." + field.key),
            };
          }
        }}
      />
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
