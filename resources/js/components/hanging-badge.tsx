import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function HangingBadge() {
    const card = useRef<HTMLDivElement>(null);
    const glares = useRef<HTMLDivElement[]>([]);
    const frame = useRef(0);
    const tilt = useRef({ x: 0, y: 0 });
    const tiltTarget = useRef({ x: 0, y: 0 });
    const lift = useRef(0);
    const liftTarget = useRef(0);
    const glarePos = useRef({ x: 50, y: 50 });
    const glareTarget = useRef({ x: 50, y: 50 });
    const glareOpacity = useRef(0);
    const glareOpacityTarget = useRef(0);
    const flipY = useRef(0);
    const flipTarget = useRef(0);
    const pressing = useRef(false);
    const hovering = useRef(false);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        const tick = () => {
            if (!pressing.current) {
                tilt.current.x += (tiltTarget.current.x - tilt.current.x) * 0.16;
                tilt.current.y += (tiltTarget.current.y - tilt.current.y) * 0.16;
            }

            lift.current += (liftTarget.current - lift.current) * 0.14;
            glarePos.current.x +=
                (glareTarget.current.x - glarePos.current.x) * 0.18;
            glarePos.current.y +=
                (glareTarget.current.y - glarePos.current.y) * 0.18;
            glareOpacity.current +=
                (glareOpacityTarget.current - glareOpacity.current) * 0.16;

            flipY.current += (flipTarget.current - flipY.current) * 0.18;

            if (Math.abs(flipTarget.current - flipY.current) < 0.35) {
                flipY.current = flipTarget.current;
            }

            if (card.current) {
                const x = tilt.current.x;
                const y = flipY.current + tilt.current.y;
                const z = lift.current;
                card.current.style.transform = `translateY(${-z * 0.35}px) translateZ(${z}px) rotateX(${x}deg) rotateY(${y}deg) scale(${1 + z * 0.0015})`;
            }

            const x = glarePos.current.x;
            const y = glarePos.current.y;
            const opacity = String(glareOpacity.current);
            const spotlight = `radial-gradient(circle at ${x}% ${y}%, #000 0%, rgba(0,0,0,0.85) 12%, transparent 34%)`;
            const glareBackground = [
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.22) 14%, transparent 36%)`,
                `repeating-linear-gradient(0deg, rgba(255,255,255,0.42) 0 1px, transparent 1px 14px)`,
                `repeating-linear-gradient(90deg, rgba(255,255,255,0.42) 0 1px, transparent 1px 14px)`,
            ].join(', ');

            for (const layer of glares.current) {
                if (!layer) {
                    continue;
                }

                layer.style.opacity = opacity;
                layer.style.backgroundImage = glareBackground;
                layer.style.maskImage = spotlight;
                layer.style.webkitMaskImage = spotlight;
            }

            frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame.current);
        };
    }, []);

    const setGlareRef = (index: number) => (node: HTMLDivElement | null) => {
        if (node) {
            glares.current[index] = node;
        }
    };

    const setPointerFromEvent = (event: PointerEvent<HTMLDivElement>) => {
        if (pressing.current) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;

        tiltTarget.current.x = (0.5 - ny) * 22;
        tiltTarget.current.y = (nx - 0.5) * 28;
        glareTarget.current.x = nx * 100;
        glareTarget.current.y = ny * 100;
    };

    const enterCard = (event: PointerEvent<HTMLDivElement>) => {
        hovering.current = true;
        liftTarget.current = 18;
        glareOpacityTarget.current = 1;
        setPointerFromEvent(event);
        glarePos.current.x = glareTarget.current.x;
        glarePos.current.y = glareTarget.current.y;
    };

    const leaveCard = () => {
        hovering.current = false;
        pressing.current = false;
        pointerStart.current = null;
        tiltTarget.current.x = 0;
        tiltTarget.current.y = 0;
        liftTarget.current = 0;
        glareOpacityTarget.current = 0;
    };

    const toggleFlip = () => {
        const next = flipTarget.current === 0 ? 180 : 0;
        flipTarget.current = next;
        tilt.current.x = 0;
        tilt.current.y = 0;
        tiltTarget.current.x = 0;
        tiltTarget.current.y = 0;
        setFlipped(next === 180);
    };

    return (
        <div className="flex items-start justify-center">
            <div className="perspective-[1200px]">
                <div
                    ref={card}
                    role="button"
                    tabIndex={0}
                    aria-pressed={flipped}
                    aria-label={
                        flipped ? 'Flip card to front' : 'Flip card to back'
                    }
                    className="relative h-[28rem] w-[21rem] cursor-pointer origin-center outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-sky/60"
                    style={{ transformStyle: 'preserve-3d' }}
                    onPointerEnter={enterCard}
                    onPointerMove={setPointerFromEvent}
                    onPointerLeave={leaveCard}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        pressing.current = true;
                        liftTarget.current = 8;
                        tiltTarget.current.x = tilt.current.x;
                        tiltTarget.current.y = tilt.current.y;
                        pointerStart.current = {
                            x: event.clientX,
                            y: event.clientY,
                        };
                    }}
                    onPointerUp={(event) => {
                        const start = pointerStart.current;
                        pressing.current = false;
                        pointerStart.current = null;
                        liftTarget.current = hovering.current ? 18 : 0;

                        try {
                            event.currentTarget.releasePointerCapture(
                                event.pointerId,
                            );
                        } catch {
                            // already released
                        }

                        if (!start) {
                            return;
                        }

                        const moved = Math.hypot(
                            event.clientX - start.x,
                            event.clientY - start.y,
                        );

                        if (moved <= 16) {
                            toggleFlip();
                        }
                    }}
                    onPointerCancel={leaveCard}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleFlip();
                        }
                    }}
                >
                    <div
                        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                        }}
                    >
                        <div
                            ref={setGlareRef(0)}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
                            style={{ opacity: 0 }}
                        />

                        <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
                            <div className="flex size-16 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/15">
                                <svg
                                    aria-hidden
                                    viewBox="0 0 16 16"
                                    className="size-7"
                                    fill="currentColor"
                                >
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                            </div>

                            <div className="text-3xl font-extrabold tracking-tighter text-white">
                                Shashimii
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="pointer-events-auto relative mx-auto w-fit">
                                        <div className="relative p-3">
                                            <span
                                                aria-hidden
                                                className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-white"
                                            />

                                            <div className="relative size-[7.25rem]">
                                                <img
                                                    src="/images/github-qr.svg"
                                                    alt="QR code for github.com/Shashimii"
                                                    className="size-full"
                                                    draggable={false}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-[#0b1220] text-white ring-2 ring-[#0b1220]">
                                                        <svg
                                                            aria-hidden
                                                            viewBox="0 0 16 16"
                                                            className="size-4"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="bottom"
                                    className="tracking-[0.12em] uppercase"
                                >
                                    Scan me
                                </TooltipContent>
                            </Tooltip>

                            <div className="absolute inset-x-0 bottom-8 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
                                Click to flip
                            </div>
                        </div>

                        <span className="pointer-events-none absolute top-3 left-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute top-3 right-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute bottom-3 left-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute right-3 bottom-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                    </div>

                    <div
                        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div
                            ref={setGlareRef(1)}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
                            style={{ opacity: 0 }}
                        />

                        <div className="pointer-events-none relative flex h-full flex-col items-center gap-3 px-8 pt-16 text-center">
                            <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-600 text-3xl font-bold text-white/70 ring-2 ring-white/15">
                                S
                            </div>

                            <div className="mt-2 text-2xl font-extrabold tracking-tight text-white uppercase">
                                Sam Reginald
                                <br />
                                Besa
                            </div>

                            <div className="font-mono text-xs leading-relaxed tracking-[0.08em] text-white/40">
                                ICT Specialist
                                <br />
                                Fullstack Developer
                            </div>

                            <div className="absolute inset-x-0 bottom-8 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
                                Click to flip
                            </div>
                        </div>

                        <span className="pointer-events-none absolute top-3 left-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute top-3 right-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute bottom-3 left-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute right-3 bottom-3 size-2.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
