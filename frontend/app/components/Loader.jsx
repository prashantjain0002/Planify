import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="animate-spin w-12 h-12" />
    </div>
  );
};

export default Loader;
