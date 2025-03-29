interface ErrorAlertProps {
    message: string;
  }
  
  export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
        <p>{message}</p>
      </div>
    );
  }