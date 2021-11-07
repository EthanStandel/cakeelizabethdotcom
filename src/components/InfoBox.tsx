import React from "react";

import classes from "../styles/components/InfoBox.module.sass";

interface Props {
  children: React.ReactChild;
  state: "error" | "success";
}

const InfoBox = ({ children, state = "success" }: Props) => (
  <div
    className={`${classes.box} ${state === "success" ? classes.success : ""} ${
      state === "error" ? classes.error : ""
    }`}
  >
    {children}
  </div>
);

export default InfoBox;
