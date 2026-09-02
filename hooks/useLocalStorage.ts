import { useSyncExternalStore, useCallback } from "react";

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener("local-storage-change", callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("local-storage-change", callback);
    };
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const getSnapshot = () => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    const getServerSnapshot = () => {
        return null;
    };

    const rawSnapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    let value: T;
    if (rawSnapshot !== null) {
        try {
            value = JSON.parse(rawSnapshot) as T;
        } catch {
            value = initialValue;
        }
    } else {
        value = initialValue;
    }

    const setValue = useCallback(
        (val: T | ((prev: T) => T)) => {
            try {
                const currentRaw = localStorage.getItem(key);
                let currentValue: T = initialValue;
                if (currentRaw !== null) {
                    try {
                        currentValue = JSON.parse(currentRaw) as T;
                    } catch {
                        currentValue = initialValue;
                    }
                }
                const newValue = typeof val === "function" ? (val as (prev: T) => T)(currentValue) : val;

                localStorage.setItem(key, JSON.stringify(newValue));
                window.dispatchEvent(new Event("local-storage-change"));
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, initialValue]
    );

    const resetValue = useCallback(() => {
        try {
            localStorage.removeItem(key);
            window.dispatchEvent(new Event("local-storage-change"));
        } catch (error) {
            console.error(`Error resetting localStorage key "${key}":`, error);
        }
    }, [key]);

    return [value, setValue, resetValue];
}
