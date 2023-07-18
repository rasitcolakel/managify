import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Stack, Typography } from "@mui/material";

export default function Cards({ cards }: { cards: Array<any> }) {
  return (
    <Stack flexDirection="column" flex="1" padding="5">
      {cards.map(({ title }, key) => {
        return <Card title={title} key={key} index={key} />;
      })}
    </Stack>
  );
}

interface CardProps {
  title: string;
  index: number;
}

export const Card = ({ title, index }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      index,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Box
      sx={{
        padding: 3,
        bgcolor: "white",
        margin: 2,
        borderRadius: 8,
        border: "2px solid gray",
        boxShadow: "0px 0px 5px 2px #2121213b",
        transform: style.transform,
      }}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <Typography>{title}</Typography>
    </Box>
  );
};
