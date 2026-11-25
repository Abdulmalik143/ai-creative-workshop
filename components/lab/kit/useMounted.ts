"use client";

import { useEffect, useState } from "react";

/** True after the first client render. Components that compute styles from the DOM (colours via canvas, WebGL) wait for it, so the server markup never disagrees with the client. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
