import React from "react";
import {useTranslate} from "@refinedev/core";
import {
    List,
    useDataGrid,
    DateField,
    EditButton,
    ShowButton,
    DeleteButton,
} from "@refinedev/mui";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {GetServerSideProps} from "next";
import {authProvider} from "src/authProvider";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Head from "next/head";
import {Team} from "src/types";
import Stack from "@mui/material/Stack";

export default function TeamList() {
    const {dataGridProps} = useDataGrid();

    const t = useTranslate();
    const columns = React.useMemo<GridColDef<Team>[]>(
        () => [
            {
                field: "id",
                headerName: t("pages.teams.fields.id"),
                type: "number",
                minWidth: 50,
            },
            {
                field: "title",
                headerName: t("pages.teams.fields.title"),
                minWidth: 200,
                flex: 1,
            },
            {
                field: "description",
                headerName: t("pages.teams.fields.description"),
                minWidth: 200,
                flex: 1,
            },
            {
                field: "created_at",
                headerName: t("pages.teams.fields.created_at"),
                minWidth: 250,
                renderCell: function render({value}) {
                    return <DateField value={value}/>;
                },
                flex: 1,
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                minWidth: 100,
                renderCell: function render({row}) {
                    return (
                        <Stack direction="row">
                            <EditButton size="small" hideText recordItemId={row.id}/>
                            <ShowButton size="small" hideText recordItemId={row.id}/>
                            <DeleteButton size="small" hideText recordItemId={row.id}/>
                        </Stack>
                    );
                },
            },
        ],
        [t]
    );

    return (
        <List>
            <Head>
                <title>{t("documentTitle.teams.list")}</title>
            </Head>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const {authenticated, redirectTo} = await authProvider.check(context);

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
