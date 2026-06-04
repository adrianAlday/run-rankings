"use client";

import { scrollIdIntoView } from "../_utils/scroll";

type ScrollToButtonProps = {
  id: string;
  classNames?: string;
  children: React.ReactNode;
};

const ScrollToButton = ({ id, classNames, children }: ScrollToButtonProps) => {
  return (
    <button
      onClick={() => {
        scrollIdIntoView(id);
      }}
      className={`cursor-pointer ${classNames}`}
    >
      {children}
    </button>
  );
};

export default ScrollToButton;
