import React from "react";
import { Spinner } from "./spinner";

const FullPageSpinner = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
    <Spinner size="xl" variant="primary" />
    <span className="mt-4 text-lg text-gray-700 dark:text-gray-200">
      Loading...
    </span>
  </div>
);

export default FullPageSpinner;
