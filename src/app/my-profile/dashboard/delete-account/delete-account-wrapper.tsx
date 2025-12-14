"use client";

import React from "react";
import DeleteAccount from "../@pages/delete-account";

export default function DeleteAccountWrapper() {
  const [show, setShow] = React.useState(true);
  
  const handleClose = () => {
    setShow(false);
  };

  return <DeleteAccount show={show} onClose={handleClose} />;
}