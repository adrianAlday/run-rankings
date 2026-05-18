"use client";

const scrollToId = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

type ScrollToButtonProps = {
  id: string;
  children: React.ReactNode;
};

const ScrollToButton = ({ id, children }: ScrollToButtonProps) => {
  return (
    <button
      onClick={() => {
        scrollToId(id);
      }}
      className="cursor-pointer"
    >
      {children}
    </button>
  );
};

export default ScrollToButton;
