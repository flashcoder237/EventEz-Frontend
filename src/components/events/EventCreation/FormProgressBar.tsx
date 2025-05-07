'use client';

import { Check } from 'lucide-react';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgressBar({ currentStep, totalSteps }: FormProgressBarProps) {
  const stepTitles = [
    'Informations générales',
    'Lieu et horaires',
    'Billetterie / Inscriptions',
    'Image et publication'
  ];

  return (
    <div className="mb-8 w-full">
      <div className="relative flex justify-between">
        {/* Connector lines - placed behind the step circles */}
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-300">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${(Math.max(0, currentStep - 1) / (stepTitles.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Step circles and labels */}
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center relative z-1">
              {/* Circle */}
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-purple-500 border-purple-500 text-white' 
                    : isActive 
                      ? 'bg-white border-purple-500 text-purple-500' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              {/* Step title */}
              <span 
                className={`mt-2 text-xs sm:text-sm ${
                  isActive ? 'font-medium text-purple-700' : 'text-gray-500'
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}