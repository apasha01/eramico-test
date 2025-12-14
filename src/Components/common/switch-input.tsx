import { FormControlLabel, Grid, Switch } from "@mui/material";
import { Controller } from "react-hook-form";

interface SwitchInputProp {
  name: string;
  control: any;
  label: string;
}

const SwitchInput = ({ name, control, label }: SwitchInputProp) => {
  return (
    <Grid item xs={12} sm={12}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                {...field}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: "blue",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "blue",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "blue",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "gray",
                  },
                }}
              />
            }
            label={label}
          />
        )}
      />
    </Grid>
  );
};

export default SwitchInput;
