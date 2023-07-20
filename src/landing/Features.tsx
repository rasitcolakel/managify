import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";

type Props = {
  isDarkMode: boolean;
};

function Features({ isDarkMode }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      xs={11}
      lg={8}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Grid container xs={12} lg={10} flexDirection="row" display="flex">
        <Grid item xs={12} lg={12} justifyContent="center">
          <Typography
            variant="h3"
            align="center"
            sx={{
              background: ` -webkit-linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.success.main} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            pb={2}
          >
            Realtime
          </Typography>
          <Grid
            container
            xs={12}
            flexDirection="row"
            display="flex"
            justifyContent="center"
          >
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" align="center" pb={2}>
                <span
                  style={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {" "}
                  Managify{" "}
                </span>
                supports realtime updates, so you can see changes as they
                happen. 👀
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Image
            src={
              "/landing/" +
              (isDarkMode ? "realtime-dark.gif" : "realtime-light.gif")
            }
            alt="landing"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: isMobile ? "0.5rem" : "1rem",
              border: "1px solid #eaeaea",
              borderColor: theme.palette.divider,
            }}
            quality={100}
          />
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        lg={10}
        flexDirection="row"
        display="flex"
        mt={isMobile ? 5 : 8}
        spacing={3}
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              background: ` -webkit-linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.success.main} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            pb={2}
          >
            Realtime Chatting
          </Typography>
          <Typography align="center" variant="h6" pt={2} color="textSecondary">
            <span
              style={{
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Managify{" "}
            </span>{" "}
            offers realtime chatting, so you can chat with your team members.
            Also, as you can see, it is a responsive web app, so you can use it
            on your mobile devices easily. 💬
          </Typography>
        </Grid>
        <Grid item xs={12} lg={10} justifyContent="center">
          <Image
            src={"/landing/chat.gif"}
            alt="landing"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: isMobile ? "0.5rem" : "1rem",
              border: "1px solid #eaeaea",
              borderColor: theme.palette.divider,
            }}
            quality={100}
          />
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        lg={10}
        flexDirection="row-reverse"
        display="flex"
        mt={isMobile ? 5 : 8}
        spacing={3}
      >
        <Grid item xs={12} lg={5}>
          <Typography variant="h4">Kanban Boards</Typography>
          <Typography variant="h6" pt={2} color="textSecondary">
            <span
              style={{
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Managify{" "}
            </span>
            have kanban boards, so you can manage your tasks easily. 📝 You can
            change the status of your tasks by dragging and dropping them.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={7} justifyContent="center">
          <Image
            src={
              "/landing/" +
              (isDarkMode ? "kanban-dark.png" : "kanban-light.png")
            }
            alt="landing"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: isMobile ? "0.5rem" : "1rem",
              border: "1px solid #eaeaea",
              borderColor: theme.palette.divider,
            }}
            quality={100}
          />
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        lg={10}
        flexDirection="row"
        display="flex"
        mt={isMobile ? 5 : 8}
        spacing={3}
        pb={3}
      >
        <Grid item xs={12} lg={5}>
          <Typography variant="h4">Easily Create Tasks</Typography>
          <Typography variant="h6" pt={2} color="textSecondary">
            You can easily create tasks by filling the status, title,
            description with rich text editor, and assignee fields with
            <span
              style={{
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Managify{" "}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12} lg={7} justifyContent="center">
          <Image
            src={
              "/landing/" +
              (isDarkMode ? "new-task-dark.png" : "new-task-light.png")
            }
            alt="landing"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: isMobile ? "0.5rem" : "1rem",
              border: "1px solid #eaeaea",
              borderColor: theme.palette.divider,
            }}
            quality={100}
          />
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        lg={10}
        flexDirection="row-reverse"
        display="flex"
        mt={isMobile ? 5 : 8}
        spacing={3}
      >
        <Grid item xs={12} lg={5}>
          <Typography variant="h4">Communicate With People</Typography>
          <Typography variant="h6" pt={2} color="textSecondary">
            <span
              style={{
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Managify{" "}
            </span>{" "}
            have realtime chatting, so you can communicate with your team
            members or other people.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={7} justifyContent="center" pb={isMobile ? 3 : 8}>
          <Image
            src={
              "/landing/" + (isDarkMode ? "chats-dark.png" : "chats-light.png")
            }
            alt="landing"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: isMobile ? "0.5rem" : "1rem",
              border: "1px solid #eaeaea",
              borderColor: theme.palette.divider,
            }}
            quality={100}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Features;
