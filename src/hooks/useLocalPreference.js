import { useCallback, useEffect, useState } from "react";
import { getPreference, setPreference } from "@/services/PreferenceService";

export default function useLocalPreference(key, fallback = null) {
    const [value, setValue] = useState(fallback);

    useEffect(() => {
        setValue(getPreference(key, fallback));
    }, [key, fallback]);

    const update = useCallback((next) => {
        setValue(next);
        setPreference(key, next);
    }, [key]);

    return [value, update];
}