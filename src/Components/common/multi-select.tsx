import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface MultiSelectProp {
  id: string;
  control: any;
  options: any[];
  label: string;
  placeholder: string;
  sm?: number;
  hasError?: boolean;
  disabled?: boolean;
}

const MultiSelect = ({
  id,
  control,
  options,
  label,
  placeholder,
  sm = 6,
  hasError,
  disabled,
}: MultiSelectProp) => {
  return (
    <Grid item xs={12} sm={sm}>
      <Controller
        key={id}
        name={id}
        control={control}
        render={({ field }) => (
          <>
            <InputLabel
              className="mb-2 fs-14 fw-400"
              style={{ color: "#9E9E9E99" }}
            >
              {label}
            </InputLabel>
            <FormControl fullWidth>
              <Select
                {...field}
                id={id}
                multiple
                displayEmpty
                className={`input-border ${hasError ? "input-error" : ""}`}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
                renderValue={(selected: any) => {
                  if (!selected || selected.length === 0) {
                    return <>{placeholder}</>;
                  }
                  return selected
                    .map(
                      (selectedId: number) =>
                        options.find((option) => option.id === selectedId)
                          ?.title || ""
                    )
                    .join(", ");
                }}
                inputProps={{ "aria-label": placeholder }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontWeight: "normal",
                    paddingLeft: "12px !important",
                  },
                  "& .MuiSelect-icon": {
                    right: "8px",
                    left: "auto",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
                {options?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox
                      checked={
                        Array.isArray(field.value) &&
                        field.value.includes(option.id)
                      }
                    />
                    <ListItemText primary={option.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      />
    </Grid>
  );
};

export default MultiSelect;
