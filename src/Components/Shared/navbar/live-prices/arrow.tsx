"use client";
import { IconButton, Toolbar } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

function Arrow({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
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
        aria-label="price-tab"
        style={{
          cursor: "pointer",
          opacity: disabled ? "0.3" : "1",
          backgroundColor: "#fff",
        }}
      >
        {children}
      </IconButton>
    </div>
  );
}

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
  return (
    <Toolbar
      style={{ minHeight: "48px", borderBottom: "1px solid #eee" }}
      className=" text-light hideInMobileScreen "
    >
      <li
        style={{ width: "130 px", whiteSpace: "nowrap", margin: "auto 16px" }}
      >
        <span className="text-black">قیمت‌های زنده</span>
      </li>
      <div className="border verticalline"></div>
    </Toolbar>
  );
}

export function RightArrow() {
  const {
    getNextElement,
    isLastItemVisible,
    scrollToItem,
    visibleElements,
    isFirstItemVisible,
    initComplete,
    getPrevElement,
  } = React.useContext(VisibilityContext);

  const [disabledLastItem, setDisabledLastItem] = React.useState(
    !visibleElements.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabledLastItem(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  const [disabledFirstItem, setDisabledFirstItem] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabledFirstItem(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  // NOTE: for scroll 1 item
  const clickHandlerPrev = () =>
    scrollToItem(getPrevElement(), "smooth", "start");

  // NOTE: for scroll 1 item
  const clickHandlerNext = () =>
    scrollToItem(getNextElement(), "smooth", "end");

  return (
    <div
      style={{
        background: "white",
        display: "flex",
        margin: "auto 16px",
      }}
    >
      <Arrow disabled={disabledFirstItem} onClick={clickHandlerPrev}>
        <NavigateNextIcon style={{ color: "#000" }} />
      </Arrow>
      <Arrow disabled={disabledLastItem} onClick={clickHandlerNext}>
        <NavigateBeforeIcon style={{ color: "#000" }} />
      </Arrow>
    </div>
  );
}
