import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MuiCreateInferencer } from "@refinedev/inferencer/mui";

export default function TeamCreate() {
  return (
    <MuiCreateInferencer
      resource="teams"
      fieldTransformer={(field) => {
        if (field.key === "title" || field.key === "description") {
          return {
            key: field.key,
            type: "text",
            relation: false,
            multiple: false,
          };
        }
      }}
    />
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