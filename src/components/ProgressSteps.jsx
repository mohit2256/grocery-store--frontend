import React from "react";

export default function ProgressSteps({ currentStep }) {
  const steps = ["Cart", "Checkout", "Success"];

  return (
    <div className="flex items-center justify-center gap-4 mb-6 mt-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300
                ${
                  index + 1 === currentStep
                    ? "bg-purple-600 text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-1 text-xs font-medium ${
                index + 1 === currentStep ? "text-purple-600" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`w-10 h-[2px] ${
                index + 1 < currentStep ? "bg-purple-600" : "bg-gray-300"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
