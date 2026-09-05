import { useCallback, useEffect, useMemo, useState } from "react";
import { getPreference, setPreference } from "@/services/PreferenceService";

export default function useActiveSelection(items, persistKey) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!persistKey) return;
    const savedId = getPreference(persistKey);
    if (savedId) setActiveId(savedId);
  }, [persistKey]);

  const active = useMemo(
      () => items.find((item) => item.id === activeId) || items[0] || null,
      [items, activeId]
  );

  const setActive = useCallback(
      (item) => {
        setActiveId(item?.id ?? null);
        if (persistKey && item?.id) setPreference(persistKey, item.id);
      },
      [persistKey]
  );

  return { active, setActive };
}