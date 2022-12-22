import React from "react";

import { Skeleton } from "./styles";

const Loader = ({ ...rest }) => {
  return (
    <div {...rest}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

export default Loader;
