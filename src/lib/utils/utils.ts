import { useStep } from 'usehooks-ts';
import React, { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';

export interface StepperReturn<T> {
  // State
  stepperState: T;
  updateState: React.Dispatch<React.SetStateAction<T>>;
  // Stepper
  currentStep: number;
  canGoToPrevStep: boolean;
  canGoToNextStep: boolean;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  resetStepper: () => void;
  setStep: Dispatch<SetStateAction<number>>;
}

/**
 * @param steps
 * @param initialState
 */
export const useStepper = <T>(steps: number = 0, initialState: T): StepperReturn<T> => {
  const [state, setState] = useState(initialState);
  const [currentStep, helpers] = useStep(steps);

  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep, reset, setStep } = helpers;

  return {
    // State
    stepperState: state,
    updateState: setState,
    // Stepper
    currentStep,
    canGoToPrevStep,
    canGoToNextStep,
    goToNextStep,
    goToPrevStep,
    resetStepper: reset,
    setStep,
  };
};

/**
 * This hook monitors the appearance of the page element in the screen scope.
 * @param trackedNode
 * @return {{item: null, visited: boolean, isIntersection: boolean}}
 */
export const useIntersected = (trackedNode: RefObject<any>, observerOptions = {}) => {
  const [intersected, setIntersected] = useState<{
    isIntersection: boolean;
    visited: boolean;
    item: IntersectionObserverEntry | null;
  }>({
    isIntersection: false,
    visited: false,
    item: null,
  });

  const observer = new IntersectionObserver(([item]) => {
    if (item.isIntersecting && !intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    } else if (!item.isIntersecting && intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: false, item }));
    } else if (item.isIntersecting && intersected.isIntersection && !intersected.visited) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    }
  }, observerOptions);

  useEffect(() => {
    const { current = null } = trackedNode;
    if (!current) return;
    observer.observe(current);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  });

  return intersected;
};
