import Link from "next/link";

type ButtonProps = { text: string; url: string };

const Button = ({ url, text }: ButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={
          "my-8 border border-[rgb(42,43,44)] rounded-md bg-[rgb(65,121,157)] py-1 flex items-center justify-center text-xs text-[rgb(253,254,255)] font-medium"
        }
      >
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default Button;
