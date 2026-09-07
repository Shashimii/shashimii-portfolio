import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import HangingBadge from '@/components/hanging-badge';
import TechStack from '@/components/tech-stack';
import { home } from '@/routes';
import { cn } from '@/lib/utils';

const projects = [
    {
        name: 'Project title',
        stack: 'Laravel · React · Postgres',
        outcome:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    },
    {
        name: 'Project title',
        stack: 'API · TypeScript',
        outcome:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    },
    {
        name: 'Project title',
        stack: 'Open source',
        outcome:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    },
] as const;

const shellX = 'px-5 sm:px-8 lg:px-[calc(2.5rem+2rem)]';

function Meta({ tokens }: { tokens: string[] }) {
    return (
        <p className="flex flex-wrap gap-x-3 font-mono text-[11px] text-white/30">
            {tokens.map((token) => (
                <span key={token}>{token}</span>
            ))}
        </p>
    );
}

function FullBleedLine({ edge }: { edge: 'top' | 'bottom' }) {
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute left-1/2 h-px w-screen -translate-x-1/2 bg-white/10',
                edge === 'top' ? 'top-0' : 'bottom-0',
            )}
        />
    );
}

function Band({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('relative py-4 sm:py-5', shellX, className)}>
            <FullBleedLine edge="top" />
            {children}
        </div>
    );
}

function MetaBand({ tokens }: { tokens: string[] }) {
    return (
        <div className={cn('relative pt-4 pb-1 sm:pt-4 sm:pb-1', shellX)}>
            <FullBleedLine edge="top" />
            <Meta tokens={tokens} />
        </div>
    );
}

function ProjectCopy({
    name,
    stack,
    outcome,
    titleClassName,
}: {
    name: string;
    stack: string;
    outcome: string;
    titleClassName: string;
}) {
    return (
        <>
            <MetaBand
                tokens={titleClassName.split(/\s+/).filter(Boolean)}
            />
            <Band>
                <h2 className={titleClassName}>{name}</h2>
            </Band>
            <MetaBand tokens={['font-mono', 'text-[12px]', 'text-sky']} />
            <Band>
                <p className="font-mono text-[12px] text-sky">{stack}</p>
            </Band>
            <MetaBand tokens={['text-white/65']} />
            <Band>
                <p className="text-white/65">{outcome}</p>
            </Band>
        </>
    );
}

function SplitCell({ children }: { children: ReactNode }) {
    return (
        <div className="border-white/10 px-5 sm:px-8 md:border-r md:last:border-r-0">
            {children}
        </div>
    );
}

function SplitRow({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('relative', className)}>
            <FullBleedLine edge="top" />
            <div className="grid md:grid-cols-2 lg:mx-10">{children}</div>
        </div>
    );
}

function MediaSlot({
    label,
    className,
}: {
    label: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex min-h-48 items-center justify-center border border-white/10 bg-canvas',
                className,
            )}
        >
            <span className="font-mono text-[11px] text-white/30">{label}</span>
        </div>
    );
}

export default function Welcome() {
    return (
        <>
            <Head title="Shashimii" />

            <div className="page-grid relative min-h-dvh overflow-x-hidden">
                <div className="relative mx-auto min-h-dvh w-full max-w-6xl lg:max-w-[calc(72rem+5rem)]">
                    <div
                        className="page-rail pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-10 border-x border-white/10 lg:block"
                        aria-hidden
                    />
                    <div
                        className="page-rail pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-10 border-x border-white/10 lg:block"
                        aria-hidden
                    />

                    <div className="relative z-10">
                    <header
                        className={cn(
                            'relative flex items-center justify-between gap-6 py-4',
                            shellX,
                        )}
                    >
                        <FullBleedLine edge="bottom" />
                        <div className="flex items-center gap-3 motion-safe:animate-rise motion-reduce:animate-none">
                            <a
                                href="https://github.com/Shashimii"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub profile"
                                className="inline-flex size-7 items-center justify-center rounded-full bg-white/5 text-white/55 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                            >
                                <svg
                                    aria-hidden
                                    viewBox="0 0 16 16"
                                    className="size-3.5"
                                    fill="currentColor"
                                >
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                            </a>
                            <Link
                                href={home.url()}
                                className="text-sm font-semibold tracking-tight"
                            >
                                Shashimii
                            </Link>
                        </div>
                        <nav
                            aria-label="Primary"
                            className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm text-white/60"
                        >
                            <a className="hover:text-white" href="#projects">
                                Projects
                            </a>
                            <a className="hover:text-white" href="#stack">
                                Stack
                            </a>
                            <a className="hover:text-white" href="#about">
                                About
                            </a>
                            <a className="hover:text-white" href="#contact">
                                Contact
                            </a>
                        </nav>
                    </header>

                    <section className="relative pt-16 sm:pt-20 lg:pt-24">
                        <div className="pointer-events-none absolute top-10 right-0 bottom-0 z-20 hidden w-[min(34rem,42%)] items-start justify-center pt-6 lg:flex">
                            <div className="pointer-events-auto motion-safe:animate-rise motion-reduce:animate-none [animation-delay:360ms]">
                                <HangingBadge />
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col">
                            <div className="flex flex-col motion-safe:animate-rise motion-reduce:animate-none">
                                <MetaBand
                                    tokens={[
                                        'text-8xl',
                                        'text-white',
                                        'tracking-tighter',
                                        'text-balance',
                                    ]}
                                />
                                <Band>
                                    <h1 className="max-w-3xl text-5xl font-extrabold tracking-tighter text-balance sm:text-7xl lg:max-w-[min(40rem,55%)] lg:text-8xl">
                                        Shashimii
                                    </h1>
                                </Band>
                            </div>

                            <div className="flex flex-col motion-safe:animate-rise motion-reduce:animate-none [animation-delay:120ms]">
                                <MetaBand
                                    tokens={[
                                        'text-lg',
                                        'text-white',
                                        'font-medium',
                                    ]}
                                />
                                <Band>
                                    <p className="max-w-2xl text-lg font-medium text-pretty text-white/80 lg:max-w-[min(36rem,52%)]">
                                        Full-stack developer creating web apps
                                        and websites for business with{' '}
                                        <span className="text-sky">Laravel</span>
                                        ,{' '}
                                        <span className="text-sky">React</span>,
                                        and{' '}
                                        <span className="text-sky">Inertia</span>
                                        .
                                    </p>
                                </Band>
                            </div>

                            <div className="mt-10 flex flex-col motion-safe:animate-rise motion-reduce:animate-none [animation-delay:240ms]">
                                <MetaBand
                                    tokens={[
                                        'rounded-full',
                                        'bg-sky',
                                        'px-5',
                                        'py-2.5',
                                        'text-sm',
                                        'font-semibold',
                                    ]}
                                />
                                <Band className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:justify-start">
                                    <a
                                        href="#projects"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-canvas hover:bg-sky/90"
                                    >
                                        Let's create
                                        <svg
                                            aria-hidden
                                            viewBox="0 0 16 16"
                                            className="size-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 12L12 4" />
                                            <path d="M6 4h6v6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center justify-between gap-8 rounded-full bg-white/5 px-5 py-2.5 text-sm text-white/55 ring-1 ring-white/10 hover:text-white"
                                    >
                                        Get in touch
                                        <span className="font-mono text-[11px] text-white/30">
                                            04
                                        </span>
                                    </a>
                                </Band>
                            </div>
                        </div>
                    </section>

                    <section id="projects">
                        <article className="flex flex-col">
                            <MetaBand
                                tokens={[
                                    'screenshot',
                                    'featured',
                                    'aspect-16/9',
                                ]}
                            />
                            <div className={cn('relative py-5 sm:py-8', shellX)}>
                                <FullBleedLine edge="top" />
                                <MediaSlot
                                    label="preview / featured"
                                    className="aspect-16/9 min-h-56 md:min-h-72"
                                />
                            </div>
                            <ProjectCopy
                                name={projects[0].name}
                                stack={projects[0].stack}
                                outcome={projects[0].outcome}
                                titleClassName="text-2xl font-semibold tracking-tight"
                            />
                        </article>
                    </section>

                    <section className="flex flex-col">
                        <SplitRow className="pt-4 pb-1 sm:pt-4 sm:pb-1">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-shot-meta`}>
                                    <Meta
                                        tokens={['screenshot', 'aspect-4/3']}
                                    />
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="py-5 sm:py-8">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-shot`}>
                                    <MediaSlot
                                        label="screenshot"
                                        className="aspect-4/3 min-h-40"
                                    />
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="pt-4 pb-1 sm:pt-4 sm:pb-1">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-title-meta`}>
                                    <Meta
                                        tokens={[
                                            'text-xl',
                                            'font-semibold',
                                            'tracking-tight',
                                        ]}
                                    />
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="py-4 sm:py-5">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-title`}>
                                    <h2 className="text-xl font-semibold tracking-tight">
                                        {project.name}
                                    </h2>
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="pt-4 pb-1 sm:pt-4 sm:pb-1">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-stack-meta`}>
                                    <Meta
                                        tokens={[
                                            'font-mono',
                                            'text-[12px]',
                                            'text-sky',
                                        ]}
                                    />
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="py-4 sm:py-5">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-stack`}>
                                    <p className="font-mono text-[12px] text-sky">
                                        {project.stack}
                                    </p>
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="pt-4 pb-1 sm:pt-4 sm:pb-1">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-out-meta`}>
                                    <Meta tokens={['text-white/65']} />
                                </SplitCell>
                            ))}
                        </SplitRow>
                        <SplitRow className="py-4 sm:py-5">
                            {projects.slice(1).map((project) => (
                                <SplitCell key={`${project.stack}-out`}>
                                    <p className="text-white/65">
                                        {project.outcome}
                                    </p>
                                </SplitCell>
                            ))}
                        </SplitRow>
                    </section>

                    <section id="stack" className="flex flex-col">
                        <MetaBand
                            tokens={[
                                'text-3xl',
                                'font-extrabold',
                                'tracking-tighter',
                            ]}
                        />
                        <Band>
                            <h2 className="text-3xl font-extrabold tracking-tighter">
                                Tech stack
                            </h2>
                        </Band>
                        <div className="relative">
                            <FullBleedLine edge="top" />
                            <TechStack />
                        </div>
                    </section>

                    <section id="about" className="flex flex-col">
                        <MetaBand
                            tokens={[
                                'text-3xl',
                                'font-extrabold',
                                'tracking-tighter',
                            ]}
                        />
                        <Band>
                            <h2 className="text-3xl font-extrabold tracking-tighter">
                                Short bio
                            </h2>
                        </Band>
                        <MetaBand
                            tokens={[
                                'max-w-2xl',
                                'text-lg',
                                'font-medium',
                                'text-white/75',
                            ]}
                        />
                        <Band>
                            <p className="max-w-2xl text-lg font-medium text-white/75">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        </Band>
                    </section>

                    <section id="contact" className="flex flex-col">
                        <MetaBand
                            tokens={[
                                'text-3xl',
                                'font-extrabold',
                                'tracking-tighter',
                            ]}
                        />
                        <Band>
                            <h2 className="text-3xl font-extrabold tracking-tighter">
                                Contact me
                            </h2>
                        </Band>
                        <MetaBand
                            tokens={['max-w-xl', 'text-white/65']}
                        />
                        <Band>
                            <p className="max-w-xl text-white/65">
                                Have a project in mind? Send me an email and
                                let’s talk.
                            </p>
                        </Band>
                        <MetaBand
                            tokens={[
                                'font-mono',
                                'text-xl',
                                'text-sky',
                                'sm:text-2xl',
                            ]}
                        />
                        <Band>
                            <a
                                className="w-fit font-mono text-xl text-sky hover:text-white sm:text-2xl"
                                href="mailto:besasamreginald36@gmail.com"
                            >
                                besasamreginald36@gmail.com
                            </a>
                        </Band>
                    </section>

                    <footer
                        className={cn(
                            'relative flex justify-between gap-4 py-6 font-mono text-[11px] text-white/35',
                            shellX,
                        )}
                    >
                        <FullBleedLine edge="top" />
                        <FullBleedLine edge="bottom" />
                        <span>Based in —</span>
                        <span>© {new Date().getFullYear()} Shashimii</span>
                    </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
