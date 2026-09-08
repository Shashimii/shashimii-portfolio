import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const storageKey = 'appearance';

const prefersDark = (): boolean =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

export function applyAppearance(appearance: Appearance): void {
    const isDark =
        appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export function getStoredAppearance(): Appearance {
    const stored = localStorage.getItem(storageKey);

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
    }

    return 'system';
}

export function setAppearance(appearance: Appearance): void {
    localStorage.setItem(storageKey, appearance);
    applyAppearance(appearance);
}

export function useAppearance(): {
    appearance: Appearance;
    updateAppearance: (value: Appearance) => void;
} {
    const [appearance, setAppearanceState] = useState<Appearance>('system');

    useEffect(() => {
        const current = getStoredAppearance();
        setAppearanceState(current);
        applyAppearance(current);

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            if (getStoredAppearance() === 'system') {
                applyAppearance('system');
            }
        };

        media.addEventListener('change', onChange);

        return () => media.removeEventListener('change', onChange);
    }, []);

    const updateAppearance = (value: Appearance) => {
        setAppearanceState(value);
        setAppearance(value);
    };

    return { appearance, updateAppearance };
}
