import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  name: string;
  icon: React.ReactNode;
  iconStyle?: React.CSSProperties & SxProps;
  value: string | React.ReactNode;
  action?: React.ReactNode;
};

export default function TaskCard({
  name,
  icon,
  value,
  iconStyle,
  action,
}: Props) {
  return (
    <Card sx={{ mt: "1em" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3.5em",
              height: "3.5em",
              borderRadius: "50%",
              bgcolor: "secondary.main",
              color: "white",
              mt: 0.5,
              mr: 1,
              ...iconStyle,
            }}
          >
            {icon}
          </Box>
          <Stack direction="column" flex={1}>
            <Typography
              variant="h6"
              sx={{
                pb: 1,
              }}
            >
              {name}
            </Typography>
            {typeof value === "string" ? (
              <Typography variant="body2">{value}</Typography>
            ) : (
              <Box>{value}</Box>
            )}
          </Stack>
          {action && <Box sx={{ pt: 1 }}>{action}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
}
