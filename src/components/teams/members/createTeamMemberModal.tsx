import { useAutocomplete } from "@refinedev/mui";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { HttpError } from "@refinedev/core";
import { Controller } from "react-hook-form";
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AddTeamMember } from ".";
import { Profile } from "src/types";

type CreateTeamMemberModalProps = {
  onClose: () => void;
};

const CreateTeamMemberModal: React.FC<
  UseModalFormReturnType<AddTeamMember, HttpError, AddTeamMember> &
    CreateTeamMemberModalProps
> = ({
  saveButtonProps,
  modal: { visible, title },
  control,
  formState: { errors },
  onClose,
}) => {
  const { autocompleteProps } = useAutocomplete<Profile>({
    resource: "profiles",
    onSearch: (value) => [
      {
        field: "full_name",
        operator: "contains",
        value,
      },
    ],
  });
  return (
    <Dialog
      open={visible}
      onClose={onClose}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <Box
        component="form"
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column" }}
        p={2}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Team"
            value="Team"
            name="team_id"
            style={{
              display: "none",
            }}
          />
          <Controller
            control={control}
            name="user_id"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              // @ts-ignore
              <Autocomplete<Profile>
                id="user_id"
                {...autocompleteProps}
                {...field}
                onChange={(_, value: any) => {
                  if (value) {
                    field.onChange(value.id);
                  }
                }}
                getOptionLabel={(item) => {
                  return (
                    autocompleteProps?.options?.find((p) => p.id === item?.id)
                      ?.full_name ?? ""
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.id?.toString() === (value?.id ?? value)?.toString()
                }
                placeholder="Select a user"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    margin="normal"
                    variant="outlined"
                    error={!!errors.user_id}
                    helperText={errors.user_id?.message}
                    required
                  />
                )}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button {...saveButtonProps} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateTeamMemberModal;
