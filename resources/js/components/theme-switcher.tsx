import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
    type Appearance,
    useAppearance,
} from '@/hooks/use-appearance';

const options: {
    value: Appearance;
    label: string;
    icon: ReactNode;
}[] = [
    {
        value: 'system',
        label: 'System',
        icon: (
            <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8" />
                <path d="M12 16v4" />
            </svg>
        ),
    },
    {
        value: 'light',
        label: 'Light',
        icon: (
            <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
            </svg>
        ),
    },
    {
        value: 'dark',
        label: 'Dark',
        icon: (
            <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                <path d="m17.5 6.5.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4z" />
                <path d="m14 4 .25.55.55.25-.55.25L14 5.6l-.25-.55L13.2 4.8l.55-.25z" />
            </svg>
        ),
    },
];

export default function ThemeSwitcher({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();
    const activeIndex = Math.max(
        0,
        options.findIndex((option) => option.value === appearance),
    );

    return (
        <div
            role="group"
            aria-label="Theme"
            className={cn(
                'relative inline-flex items-center rounded-full bg-slate-200/80 p-0.5 ring-1 ring-slate-900/10 dark:bg-slate-800 dark:ring-white/10',
                className,
            )}
        >
            <span
                aria-hidden
                className="absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-white/15 dark:shadow-none motion-reduce:transition-none"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />

            {options.map((option) => {
                const active = appearance === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-label={option.label}
                        aria-pressed={active}
                        onClick={() => updateAppearance(option.value)}
                        className={cn(
                            'relative z-10 inline-flex size-6 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 dark:text-white/50',
                            active
                                ? 'text-slate-900 dark:text-white'
                                : 'hover:text-slate-800 dark:hover:text-white/80',
                        )}
                    >
                        {option.icon}
                    </button>
                );
            })}
        </div>
    );
}
