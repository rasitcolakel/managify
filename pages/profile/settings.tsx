import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslate } from "@refinedev/core";
import Head from "next/head";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TabPanel from "@components/common/TabPanel";
import UpdateProfile from "@components/settings/UpdateProfile";
import ChangePassword from "@components/settings/ChangePassword";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EditProfile() {
  const t = useTranslate();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main>
      <Head>
        <title>
          {t("profiles.settings") + " | " + t("documentTitle.default")}
        </title>
      </Head>
      <Tabs value={value} onChange={handleChange}>
        <Tab label={t("profiles.update")} {...a11yProps(0)} />
        <Tab label={t("profiles.password")} {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UpdateProfile />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ChangePassword />
      </TabPanel>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const tProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...tProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/teams")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...tProps,
    },
  };
};
