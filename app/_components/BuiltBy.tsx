import Link from "next/link";

const BuiltBy = () => (
  <Link target="_blank" href={"https://github.com/adrianAlday"}>
    <div className="my-8 text-xs">
      Built by <span className="underline">Adrian</span>
    </div>
  </Link>
);

export default BuiltBy;
