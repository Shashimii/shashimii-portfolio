import type { SimpleIcon } from 'simple-icons';
import {
    siDjango,
    siDocker,
    siFlutter,
    siGit,
    siInertia,
    siJavascript,
    siLaravel,
    siMysql,
    siNodedotjs,
    siPhp,
    siPython,
    siReact,
    siTailwindcss,
    siThreedotjs,
    siTypescript,
    siVuedotjs,
} from 'simple-icons';

const stack: { name: string; icon: SimpleIcon }[] = [
    { name: 'Laravel', icon: siLaravel },
    { name: 'React', icon: siReact },
    { name: 'Inertia', icon: siInertia },
    { name: 'PHP', icon: siPhp },
    { name: 'TypeScript', icon: siTypescript },
    { name: 'JavaScript', icon: siJavascript },
    { name: 'Tailwind', icon: siTailwindcss },
    { name: 'Vue', icon: siVuedotjs },
    { name: 'Node.js', icon: siNodedotjs },
    { name: 'MySQL', icon: siMysql },
    { name: 'Python', icon: siPython },
    { name: 'Git', icon: siGit },
    { name: 'Docker', icon: siDocker },
    { name: 'Flutter', icon: siFlutter },
    { name: 'Django', icon: siDjango },
    { name: 'Three.js', icon: siThreedotjs },
];

function BrandIcon({ icon, title }: { icon: SimpleIcon; title: string }) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            aria-label={title}
            className="size-8 fill-white sm:size-9"
        >
            <title>{title}</title>
            <path d={icon.path} />
        </svg>
    );
}

export default function TechStack() {
    return (
        <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:mx-10 lg:grid-cols-4">
            {stack.map(({ name, icon }) => (
                <div
                    key={name}
                    className="flex h-28 flex-col items-center justify-center gap-3 bg-canvas px-4 sm:h-32"
                >
                    <BrandIcon icon={icon} title={name} />
                    <span className="text-center text-[13px] font-semibold tracking-tight text-white/90 sm:text-sm">
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
}
