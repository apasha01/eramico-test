'use client';
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import React from "react";
import dynamic from 'next/dynamic';
const RegisterStep1 = dynamic(() => import('./RegisterStep1'));
const RegisterStep2 = dynamic(() => import('./RegisterStep2'));
const RegisterStep3 = dynamic(() => import('./RegisterStep3'));
const RegisterStep4 = dynamic(() => import('./RegisterStep4'));
 

// This component represents the registration process with multiple steps.
// Step 1: Get the first input (email, username, or phone) its login mode
// You can add the corresponding input field and logic for handling the input value.
// Step 1: Authenticate the input its register mode
// You can add authentication logic and UI elements for this step.
// Step 2: Verify the registration
// You can add verification logic and UI elements for this step.
// Step 3: Update the user's profile
// You can add profile update logic and UI elements for this step.
// Step 4: Update follow category list
// You can add logic and UI elements for updating the follow category list.

export default function Register(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
  setOpenModal: (value: boolean) => void;
}) {
  return (
    <div>
      {/* Conditionally render the appropriate step based on the current step in the registration process */}
      {props.State.step === 1 && (
        <RegisterStep1
          {...props}
          HandleSendUserNameToBackend={props.HandleSendUserNameToBackend}
        />
      )}
      {props.State.step === 2 && <RegisterStep2 {...props} />}
      {props.State.step === 3 && <RegisterStep3 {...props} />}
      {props.State.step === 4 && (
        <RegisterStep4 {...props} setOpenModal={props.setOpenModal} />
      )}
    </div>
  );
}
