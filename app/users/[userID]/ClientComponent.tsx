"use client";

import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function ClientComponent(props: Props) {
  return <>{props.children}</>;
}
