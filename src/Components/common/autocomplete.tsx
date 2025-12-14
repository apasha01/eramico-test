import { Autocomplete, Grid, InputLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";

interface AutocompleteProps {
  name: string;
  placeholder: string;
  label: string;
  control: any;
  options: any;
  hasError: boolean;
}

const AutoComplete = ({
  name,
  placeholder,
  label,
  control,
  options,
  hasError,
}: AutocompleteProps) => {
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <InputLabel
              className="fs-14 mb-2 fw-400"
              style={{ color: "#9E9E9E99" }}
            >
              {label}
            </InputLabel>
            <Autocomplete
              {...field}
              options={options}
              getOptionLabel={(option: any) =>
                option?.title ? option.title : ""
              }
              isOptionEqualToValue={(option: any, value) => option.id === value}
              className={`input-border ${hasError ? " input-error" : ""}`}
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  display: "none !important",
                },
                "& .MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              }}
              noOptionsText="موردی یافت نشد"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <SearchIcon style={{ color: "#b0b0b0" }} />
                      </>
                    ),
                  }}
                />
              )}
              value={
                options.find((option: any) => option.id === field.value) || null
              }
              onChange={(_, value) => field.onChange(value?.id || "")}
            />
          </>
        )}
      />
    </Grid>
  );
};

export default AutoComplete;
