import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState<Boolean>(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event)
    setIsVisible(payload.state);
  });

  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "bg-[#171717] border-2 border-neutral-700 flex flex-col rounded-3xl overflow-hidden shadow-lg transition-all duration-300"
      )}
    >
      <div className="flex justify-between items-center p-4 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <X
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer transition-colors duration-300"
          onClick={onCloseApp}
        />
      </div>

      <div className="flex-1 h-0 overflow-auto px-4 py-3">{children}</div>

      <div className="p-4 flex items-center justify-between w-full bg-[#202020] rounded-b-3xl">
        <div className="flex items-center gap-x-3">
          <img src="/logo.svg" alt="app logo" className="w-10 h-10" />
          <p className="text-white text-xl font-semibold">Opal</p>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
