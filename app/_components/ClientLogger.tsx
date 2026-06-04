"use client";

type ClientLoggerProps = {
  message: string;
};

const ClientLogger = ({ message }: ClientLoggerProps) => {
  console.log(message);

  return null;
};

export default ClientLogger;
