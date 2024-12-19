import type { PropsWithChildren } from "react";
import { Header } from "../home/header";

const accidentlayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  );
};

export default accidentlayout;
