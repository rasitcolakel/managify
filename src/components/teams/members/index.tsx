import React, {useCallback} from "react";
import {TeamWithMembers} from "src/types";
import RenderMember from "./RenderMember";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Add from "@mui/icons-material/Add";
import RoundedIconButton from "@components/common/RoundedIconButton";
import {Typography} from "@mui/material";

type Props = {
    teamMembers: TeamWithMembers["teamMembers"];
};

export const TeamMembers = ({teamMembers}: Props) => {
    const renderMember = useCallback(
        (teamMember: Props["teamMembers"][0]) => (
            <Grid key={teamMember.id} item xs={12} sm={6} md={6} lg={4} xl={3}>
                <RenderMember key={teamMember.id} teamMember={teamMember}/>
            </Grid>
        ),
        []
    );

    return (
        <Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" pt={1} pr={1}>
                <Typography variant="h6">{`Members(${teamMembers.length})`}</Typography>
                <RoundedIconButton
                    icon={
                        <Add
                            style={{
                                color: "white",
                            }}
                        />
                    }
                    sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}
                />
            </Stack>
            <Grid container spacing={1}>
                {teamMembers.map((teamMember) => renderMember(teamMember))}
            </Grid>
        </Stack>
    );
};
