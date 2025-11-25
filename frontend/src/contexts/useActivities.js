// frontend/src/hooks/useActivities.js
import { useContext } from "react";
import { ActivityContext } from "./ActivityContext";

export const useActivities = () => {
  return useContext(ActivityContext);
};
