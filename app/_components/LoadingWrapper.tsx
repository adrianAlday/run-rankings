import { Suspense } from "react";

type LoadingWrapperProps = {
  children: React.ReactNode;
};

const LoadingWrapper = ({ children }: LoadingWrapperProps) => (
  <Suspense
    fallback={
      <div>
        <div className="flex items-center justify-center">
          <svg
            className="mr-3 -ml-1 size-5 animate-spin text-[rgb(189,190,191)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-33"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />

            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
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
