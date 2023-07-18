import ImageAvatar from "@components/common/ImageAvatar";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  AvatarGroup,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslate } from "@refinedev/core";
import { useCallback } from "react";
import { TaskWithAssignee, TeamMemberWithProfile } from "src/types";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
  important,
  readableDate,
} from "src/utility";
import { StyledLink } from "@components/index";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
interface LaneProps {
  title: string;
  items: any[];
  id: string;
}

const StyledBox = styled(Box)(({ theme }) => {
  const bg = theme.palette.background.paper;
  return {
    background: important(bg),
    padding: "1rem",
    borderRadius: 5,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.35)",
    marginBottom: "1rem",
  };
});

const Item = ({
  item,
  index,
  parent,
}: {
  item: TaskWithAssignee;
  index: number;
  parent: string;
}) => {
  const t = useTranslate();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: {
      item,
      index,
      parent,
    },
  });

  const renderAssignee = (assignee: TeamMemberWithProfile) => {
    const fullName = assignee?.profile?.full_name || "";
    return (
      <ImageAvatar
        user={assignee.profile}
        sizes="small"
        sx={{
          bgcolor: generateRandomColorWithName(fullName),
          height: "1.5em",
          width: "1.5em",
        }}
        key={assignee.id}
      >
        <Typography variant="body2" color="white">
          {getFirstLettersOfWord(fullName)}
        </Typography>
      </ImageAvatar>
    );
  };

  const renderPriority = useCallback(
    (priority: string) => {
      const color =
        priority === "high"
          ? "error"
          : priority === "medium"
          ? "warning"
          : "success";

      return (
        <Chip
          label={t(`tasks.taskPriorities.${priority}`)}
          color={color}
          size="small"
        />
      );
    },
    [t]
  );

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <StyledBox
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      sx={{
        transform: style.transform,
      }}
    >
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Typography variant="h6" component="span">
            {item.title}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            {renderPriority(item.priority as string)}
            <StyledLink
              href={`/teams/${item.team_id}/tasks/show/${item.id}`}
              itemType="icon"
            >
              <RemoveRedEyeIcon />
            </StyledLink>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          sx={{
            color: "text.secondary",
          }}
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Stack direction="row">
            <AlarmAddIcon />
            <Typography>{readableDate(item.due_date || "")}</Typography>
          </Stack>

          <AvatarGroup max={4}>
            {item?.taskAssignments?.map((taskAssignment: any) => {
              return renderAssignee(taskAssignment.assignee);
            })}
          </AvatarGroup>
        </Stack>
      </Stack>
    </StyledBox>
  );
};

export default function Lane({ title, items, id }: LaneProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        borderRadius: 5,
        flex: 1,
        flexDirection: "row",
        height: "100%",
      }}
    >
      <Typography variant="h6" mb={3}>
        {title}
      </Typography>

      {items.map((item, key) => (
        <Item item={item} key={key} index={key} parent={id} />
      ))}
    </Paper>
  );
}
