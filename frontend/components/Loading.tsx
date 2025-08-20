import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-screen h-screen rounded-full mx-auto mb-4 flex flex-col items-center justify-center">
      <div className="h-50 w-100 bg-gray-300 flex flex-col items-center justify-center rounded-xl">
        <p className="font-light text-xl mb-2">Please Wait...</p>
        <Loader className="w-6 h-6 text-gray-800 animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
