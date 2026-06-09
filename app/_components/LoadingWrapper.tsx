import { Suspense } from "react";

type LoadingWrapperProps = {
  children: React.ReactNode;
};

const LoadingWrapper = ({ children }: LoadingWrapperProps) => (
  <Suspense
    fallback={
      <div>
        <div className="mt-8 flex justify-center animate-pulse">
          <div className="flex space-x-2">
            <div className="rounded-full h-2 w-2 bg-[rgb(189,190,191)] animate-bounce [animation-delay:-0.3s]" />

            <div className="rounded-full h-2 w-2 bg-[rgb(189,190,191)] animate-bounce [animation-delay:-0.15s]" />

            <div className="rounded-full h-2 w-2 bg-[rgb(189,190,191)] animate-bounce" />
          </div>
        </div>

        {
          // more data needed to display on mobile
        }
        <div className="text-[rgb(18,19,20)]">
          There{"'"}s a wise saying that goes like this: A real gentleman never
          discusses women he{"'"}s broken up with or how much tax he{"'"}s paid.
          Actually, this is a total lie. I just made it up. Sorry! But if there
          really were such a saying, I think that one more condition for being a
          gentleman would be keeping quiet about what you do to stay healthy. A
          gentleman shouldn{"'"}t go on and on about what he does to stay fit.
          At least that{"'"}s how I see it.
        </div>
      </div>
    }
  >
    {children}
  </Suspense>
);

export default LoadingWrapper;
