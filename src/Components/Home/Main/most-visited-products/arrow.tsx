import { IconButton, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

interface ArrowProps {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}

const Arrow = ({ children, disabled, onClick }: ArrowProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton
        disabled={disabled}
        onClick={onClick}
        aria-label="Popular products"
        style={{
          cursor: "pointer",
          opacity: disabled ? "0.3" : "1",
          backgroundColor: "#fff",
          height: "40px",
        }}
      >
        {children}
      </IconButton>
    </div>
  );
};

export function LeftArrow() {
  const {
    getPrevElement,
    isFirstItemVisible,
    scrollToItem,
    visibleElements,
    initComplete,
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  // NOTE: for scroll 1 item
  const clickHandler = () => scrollToItem(getPrevElement(), "smooth", "start");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      <Typography variant="body1" style={{ whiteSpace: "nowrap" }}>
        کالاهای پربازدید
      </Typography>
      <Arrow disabled={disabled} onClick={clickHandler}>
        <NavigateNextIcon style={{ color: "#000" }} />
      </Arrow>
    </div>
  );
}

export function RightArrow() {
  const { getNextElement, isLastItemVisible, scrollToItem, visibleElements } =
    React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleElements.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  // NOTE: for scroll 1 item
  const clickHandler = () => scrollToItem(getNextElement(), "smooth", "end");
  return (
    <Arrow disabled={disabled} onClick={clickHandler}>
      <NavigateBeforeIcon style={{ color: "#000" }} />
    </Arrow>
  );
}

export default Arrow;
