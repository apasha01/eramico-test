import React from "react";
import styles from "./styles.module.css";

interface RegisterCompanyStatusProps {
  steps: any;
  currentStep: number;
}

const RegisterCompanyStatus = ({
  steps,
  currentStep,
}: RegisterCompanyStatusProps) => {
  return (
    <div className={styles.RegisterStatusContainer}>
      {steps.map((stage: any, index: number) => {
        const isCurrentStep = currentStep === index;
        const isPassedStep = currentStep > index;
        return (
          <div key={index} className={styles.stage}>
            <div
              className={`${styles.iconContainer} ${
                isCurrentStep
                  ? styles.active
                  : isPassedStep
                  ? styles.passed
                  : ""
              }`}
            >
              {stage.icon}
            </div>
            <span
              className={`${styles.title} ${
                isCurrentStep
                  ? styles.activeText
                  : isPassedStep
                  ? styles.activeText
                  : ""
              }`}
            >
              {stage.title}
            </span>
            {index < steps.length - 1 && <div className={styles.line}></div>}
          </div>
        );
      })}
    </div>
  );
};

export default RegisterCompanyStatus;
