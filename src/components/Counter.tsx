import React, { useEffect } from "react";
import { observer } from "mobx-react";

export interface CounterProps {
  count: number;
}

export const Counter = observer(({ count }: CounterProps) => {
  return <h2>We've been mounted for {count} seconds</h2>;
});
