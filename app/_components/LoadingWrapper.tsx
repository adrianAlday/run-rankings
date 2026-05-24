import { Suspense } from "react";

type LoadingWrapperProps = {
  children: React.ReactNode;
};

const LoadingWrapper = ({ children }: LoadingWrapperProps) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center space-x-1.5">
        <div className="rounded-full h-1.5 w-1.5 bg-[rgb(189,190,191)] animate-bounce [animation-delay:-0.3s]" />
        <div className="rounded-full h-1.5 w-1.5 bg-[rgb(189,190,191)] animate-bounce [animation-delay:-0.15s]" />
        <div className="rounded-full h-1.5 w-1.5 bg-[rgb(189,190,191)] animate-bounce" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default LoadingWrapper;
