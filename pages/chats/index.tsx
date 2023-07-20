import React, { useContext } from "react";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ChatsContextProvider } from "@contexts/ChatsContext";
import ChatsComponent from "@components/chats";
import { useTranslate } from "@refinedev/core";
import Head from "next/head";
import { ColorModeContext } from "@contexts/index";
export default function Chats() {
  const { profile } = useContext(ColorModeContext);

  const t = useTranslate();
  return (
    <>
      <Head>
        <title>
          {t("documentTitle.show", {
            title: t("chats.title"),
          })}
        </title>
      </Head>
      {profile && (
        <ChatsContextProvider>
          <ChatsComponent />
        </ChatsContextProvider>
      )}
    </>
  );
}

Chats.noPadding = true;

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
        destination: `${redirectTo}?to=${encodeURIComponent("/chats")}`,
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
