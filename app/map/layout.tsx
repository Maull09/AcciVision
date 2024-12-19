import type { PropsWithChildren } from "react";
import { Header } from "../home/header";

const mapLayout = ({ children }: PropsWithChildren) => {
  return (  
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex h-full w-full flex-col bg-white">
        {children}
      </div>
    </div>
  );
};

export default mapLayout;
