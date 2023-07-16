import * as React from "react";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useTranslate } from "@refinedev/core";
import { addComment } from "src/services/tasks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { grey } from "@mui/material/colors";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import QuillEditor from "./create/editor";

type NewCommentProps = {
  id: string;
  isDark: boolean;
  teamId: string;
  refresh: () => Promise<void>;
  isDone: boolean;
};

export default function NewComment({
  id,
  isDark,
  teamId,
  refresh,
  isDone,
}: NewCommentProps) {
  const t = useTranslate();
  const [comment, setComment] = React.useState("");
  const onChange = (value: any) => {
    setComment(value);
  };

  const saveComment = async (makeDone: boolean) => {
    await addComment(parseInt(id), parseInt(teamId), comment, makeDone);
  };

  const onSubmit = async () => {
    await saveComment(false);
    setComment("");
  };

  const onDone = async () => {
    await saveComment(true);
    await refresh();
    setComment("");
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor: isDark ? grey[800] : grey[100],
          }}
        >
          <AddBoxIcon
            sx={{
              color: isDark ? grey[400] : grey[600],
            }}
          />
        </TimelineDot>
      </TimelineSeparator>
      <TimelineContent
        sx={{
          alignSelf: "center",
        }}
      >
        <Paper>
          <Typography variant="body1" sx={{ padding: " 0.5rem 1rem" }}>
            {t("tasks.newComment")}
          </Typography>
          <Box sx={{ p: 1 }}>
            <QuillEditor
              style={{
                width: "100%",
              }}
              onChange={onChange}
              value={comment}
              quillEditorProps={{
                minHeight: "50px",
              }}
            />
          </Box>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ p: 1 }}
            spacing={1}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={onDone}
              disabled={comment.length === 0 || isDone}
            >
              {t("tasks.doneTask")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={comment.length === 0 || isDone}
            >
              {t("tasks.comment")}
            </Button>
          </Stack>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
}
