"use client"
// components/RegistrationForm.tsx
import React from 'react';
import { Steps } from 'antd';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import styles from './Registration.module.css';
import { FormData } from '../../../../interfaces/user-interfaces/types';

const { Step } = Steps;

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({});

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div className={styles.container}>
      <Steps current={currentStep}>
        <Step title="Basic Info" />
        <Step title="Verify Phone" />
        <Step title="Additional Info" />
      </Steps>

      {currentStep === 0 && (
        <StepOneForm next={next} setFormData={setFormData} />
      )}
      {currentStep === 1 && (
        <StepTwoForm
          next={next}
          prev={prev}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {currentStep === 2 && (
        <StepThreeForm prev={prev} formData={formData} />
      )}
    </div>
  );
};

export default RegistrationForm;