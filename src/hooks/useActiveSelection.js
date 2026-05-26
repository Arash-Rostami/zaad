import { useState } from "react";

export default function useActiveSelection(items) {
  const [active, setActive] = useState(null);
  return {
    active: active || items[0] || null,
    setActive,
  };
}
