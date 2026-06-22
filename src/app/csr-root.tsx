"use client";

import dynamic from "next/dynamic";

export const CSR_Root = dynamic(() => import("./app-shell"), {
  ssr: false,
});
