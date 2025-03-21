import React from "react";
import { Link } from "react-router-dom";

interface Props {
  message?: string;
  to?: `/${string}`;
}

const NotFound = ({ message, to }: Props) => {
  return (
    <div className="h-screen col gap-y-5 justify-center items-center">
      <h1>{message ?? "No Such Project"}</h1>
      <Link to={to ?? "/"} className="button">
        Return and Make a new Project
      </Link>
    </div>
  );
};

export default NotFound;
