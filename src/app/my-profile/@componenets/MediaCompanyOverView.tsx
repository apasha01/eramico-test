import React from "react";
import { Button, Typography } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import SuggestionMedia from "./SuggestionMedia/scroll";

const Media = ({ onSelect }) => {
  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4">
        <Typography className="fs-19 fw-500 mb-2">رسانه‌ها</Typography>
        <SuggestionMedia />
        <div style={{ marginBottom: "8px", marginTop: "24px" }}>
          <Button
            variant="outlined"
            endIcon={<IoArrowBack size={18} style={{ marginLeft: "-8px" }} />}
            style={{
              border: "none",
              color: "#424242",
              background: "#FAFAFA",
              height: "42px",
              display: "flex",
              flexWrap: "nowrap",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              width: "fit-content",
            }}
            onClick={() => onSelect(2)}
          >
            مشاهده همه
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Media;
