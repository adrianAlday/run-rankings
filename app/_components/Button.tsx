import Link from "next/link";

type ButtonProps = { text: string; url: string };

const Button = ({ url, text }: ButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={
          "my-8 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md bg-[rgb(36,50,59)] py-1 flex items-center justify-center text-sm font-medium transition-all duration-700 transition-discrete"
        }
      >
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default Button;
