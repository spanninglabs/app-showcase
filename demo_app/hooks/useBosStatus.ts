import { useEffect, useState } from "react";

import { isBosUp } from "@spanning/utils";

const useBosStatus = () => {
  const [bosIsUp, setBosIsUp] = useState<boolean>(true);

  useEffect(() => {
    const checkBos = async () => {
      setBosIsUp(await isBosUp());
    };
    checkBos();
    const interval = setInterval(() => {
      checkBos();
    }, 10000 /* ms */);
    return () => clearInterval(interval);
  }, []);

  return {
    bosIsUp: bosIsUp,
  };
};

export { useBosStatus };
