import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
      <AlertCircle className="mr-2 h-5 w-5" />
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
