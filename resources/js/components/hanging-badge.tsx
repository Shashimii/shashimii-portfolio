import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function HangingBadge() {
    const hang = useRef<HTMLDivElement>(null);
    const flip = useRef<HTMLDivElement>(null);
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
    const drag = useRef({ x: 0, y: 0 });
    const dragTarget = useRef({ x: 0, y: 0 });
    const pressing = useRef(false);
    const hovering = useRef(false);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const lastPointer = useRef<{ x: number; y: number } | null>(null);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        const clampPercent = (value: number) =>
            Math.min(100, Math.max(0, value));

        const tick = () => {
            if (!pressing.current) {
                tilt.current.x += (tiltTarget.current.x - tilt.current.x) * 0.16;
                tilt.current.y += (tiltTarget.current.y - tilt.current.y) * 0.16;
            }

            drag.current.x += (dragTarget.current.x - drag.current.x) * 0.22;
            drag.current.y += (dragTarget.current.y - drag.current.y) * 0.22;

            lift.current += (liftTarget.current - lift.current) * 0.14;
            glareOpacity.current +=
                (glareOpacityTarget.current - glareOpacity.current) * 0.16;

            flipY.current += (flipTarget.current - flipY.current) * 0.18;

            if (Math.abs(flipTarget.current - flipY.current) < 0.35) {
                flipY.current = flipTarget.current;
            }

            if (hang.current) {
                const x = tilt.current.x;
                const y = tilt.current.y;
                const z = lift.current;
                const dx = drag.current.x;
                const dy = drag.current.y;
                hang.current.style.transform = `translate3d(${dx}px, ${dy - z * 0.2}px, ${z}px) rotateX(${x}deg) rotateY(${y}deg)`;
            }

            if (flip.current) {
                flip.current.style.transform = `rotateY(${flipY.current}deg)`;
            }

            if (hovering.current && lastPointer.current && card.current) {
                const rect = card.current.getBoundingClientRect();

                if (rect.width > 0 && rect.height > 0) {
                    const scaleX = card.current.offsetWidth / rect.width;
                    const scaleY = card.current.offsetHeight / rect.height;
                    const localX =
                        (lastPointer.current.x - rect.left) * scaleX;
                    const localY =
                        (lastPointer.current.y - rect.top) * scaleY;
                    const gx = (localX / card.current.offsetWidth) * 100;
                    const gy = (localY / card.current.offsetHeight) * 100;

                    glarePos.current.x = clampPercent(gx);
                    glarePos.current.y = clampPercent(gy);
                    glareTarget.current.x = glarePos.current.x;
                    glareTarget.current.y = glarePos.current.y;
                }
            }

            const x = glarePos.current.x;
            const y = glarePos.current.y;
            const opacity = String(glareOpacity.current);
            const spotlight = `radial-gradient(circle at ${x}% ${y}%, #000 0%, rgba(0,0,0,0.85) 12%, transparent 34%)`;
            const glareBackground = [
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.38) 14%, transparent 36%)`,
                `repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 36px)`,
                `repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 36px)`,
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
        lastPointer.current = { x: event.clientX, y: event.clientY };

        if (pressing.current && pointerStart.current) {
            const dx = event.clientX - pointerStart.current.x;
            const dy = event.clientY - pointerStart.current.y;
            dragTarget.current.x = Math.min(42, Math.max(-42, dx * 0.35));
            dragTarget.current.y = Math.min(48, Math.max(-12, dy * 0.3));
            tiltTarget.current.x = Math.min(14, Math.max(-14, (-dy / 180) * 18));
            tiltTarget.current.y = Math.min(18, Math.max(-18, (dx / 180) * 22));
            tilt.current.x = tiltTarget.current.x;
            tilt.current.y = tiltTarget.current.y;
            return;
        }

        const cardEl = card.current;

        if (!cardEl) {
            return;
        }

        const cardRect = cardEl.getBoundingClientRect();

        if (cardRect.width > 0 && cardRect.height > 0) {
            const nx = (event.clientX - cardRect.left) / cardRect.width;
            const ny = (event.clientY - cardRect.top) / cardRect.height;
            tiltTarget.current.x = (0.5 - ny) * 22;
            tiltTarget.current.y = (nx - 0.5) * 28;
        }
    };

    const enterCard = (event: PointerEvent<HTMLDivElement>) => {
        hovering.current = true;
        liftTarget.current = 18;
        glareOpacityTarget.current = 1;
        setPointerFromEvent(event);
    };

    const leaveCard = () => {
        hovering.current = false;
        pressing.current = false;
        pointerStart.current = null;
        lastPointer.current = null;
        tiltTarget.current.x = 0;
        tiltTarget.current.y = 0;
        dragTarget.current.x = 0;
        dragTarget.current.y = 0;
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
        drag.current.x = 0;
        drag.current.y = 0;
        dragTarget.current.x = 0;
        dragTarget.current.y = 0;
        setFlipped(next === 180);
    };

    return (
        <div className="flex items-start justify-center overflow-visible">
            <div className="perspective-[1200px] overflow-visible">
                <div
                    ref={hang}
                    role="button"
                    tabIndex={0}
                    aria-pressed={flipped}
                    aria-label={
                        flipped ? 'Flip card to front' : 'Flip card to back'
                    }
                    className="relative flex w-[15rem] cursor-grab flex-col items-center outline-none select-none will-change-transform [-webkit-touch-callout:none] [transform-origin:center_6%] [&_*]:cursor-inherit [&_*]:select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-sky/60"
                    style={{ transformStyle: 'preserve-3d', userSelect: 'none' }}
                    onDragStart={(event) => event.preventDefault()}
                    onPointerEnter={enterCard}
                    onPointerMove={setPointerFromEvent}
                    onPointerLeave={leaveCard}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        pressing.current = true;
                        liftTarget.current = 8;
                        pointerStart.current = {
                            x: event.clientX,
                            y: event.clientY,
                        };
                    }}
                    onPointerUp={(event) => {
                        const start = pointerStart.current;
                        pressing.current = false;
                        pointerStart.current = null;
                        dragTarget.current.x = 0;
                        dragTarget.current.y = 0;
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

                        if (moved <= 22) {
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
                        ref={flip}
                        className="relative flex w-full flex-col items-center will-change-transform [transform-origin:center_70%]"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                    <div
                        aria-hidden
                        className="pointer-events-none relative z-20 -mt-24 -mb-[1.35rem] flex w-full flex-col items-center"
                    >
                        <div className="relative flex h-[22rem] w-5 items-center justify-center overflow-hidden bg-[#0a0a0a]">
                            <span
                                className="whitespace-nowrap font-sans text-[7px] font-medium tracking-[0.28em] text-white/40 uppercase"
                                style={{
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                }}
                            >
                                Shashimii Shashimii Shashimii Shashimii Shashimii
                            </span>
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#f8fafc] to-transparent dark:from-canvas" />
                            <div className="absolute inset-x-0 bottom-[1.35rem] z-30 h-px bg-white/10" />
                        </div>
                    </div>

                    <div
                        ref={card}
                        className="relative h-[20rem] w-[15rem] will-change-transform"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div
                            className="absolute inset-0 overflow-hidden rounded-md border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(0deg)',
                            }}
                        >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute top-3.5 left-1/2 z-20 flex h-2 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#020617] shadow-[inset_0_1px_2px_rgba(0,0,0,0.85)] ring-1 ring-white/20"
                        >
                            <span className="h-1 w-5 rounded-[1px] bg-[#0a0a0a] shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                        </div>
                        <div
                            ref={setGlareRef(0)}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
                            style={{ opacity: 0 }}
                        />

                        <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                            <div className="flex size-11 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/15">
                                <svg
                                    aria-hidden
                                    viewBox="0 0 16 16"
                                    className="size-5"
                                    fill="currentColor"
                                >
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                            </div>

                            <div className="text-xl font-extrabold tracking-tighter text-white">
                                Shashimii
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="pointer-events-auto relative mx-auto w-fit">
                                        <div className="relative p-2.5">
                                            <span
                                                aria-hidden
                                                className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white"
                                            />
                                            <span
                                                aria-hidden
                                                className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white"
                                            />

                                            <div className="relative size-20">
                                                <img
                                                    src="/images/github-qr.svg"
                                                    alt="QR code for github.com/Shashimii"
                                                    className="size-full"
                                                    draggable={false}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex size-6 items-center justify-center rounded-full bg-[#0b1220] text-white ring-2 ring-[#0b1220]">
                                                        <svg
                                                            aria-hidden
                                                            viewBox="0 0 16 16"
                                                            className="size-3"
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

                            <div className="absolute inset-x-0 bottom-6 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
                                Click to flip
                            </div>
                        </div>

                        <span className="pointer-events-none absolute top-3 left-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute top-3 right-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute bottom-3 left-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute right-3 bottom-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                    </div>

                        <div
                            className="absolute inset-0 overflow-hidden rounded-md border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                            }}
                        >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute top-3.5 left-1/2 z-20 flex h-2 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#020617] shadow-[inset_0_1px_2px_rgba(0,0,0,0.85)] ring-1 ring-white/20"
                        >
                            <span className="h-1 w-5 rounded-[1px] bg-[#0a0a0a] shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                        </div>
                        <div
                            ref={setGlareRef(1)}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
                            style={{ opacity: 0 }}
                        />

                        <div className="pointer-events-none relative flex h-full flex-col items-center gap-2 px-6 pt-12 text-center">
                            <div className="size-14 overflow-hidden rounded-full ring-2 ring-white/15">
                                <img
                                    src="/images/avatar.png"
                                    alt="Sam Reginald Besa"
                                    className="size-full object-cover"
                                    draggable={false}
                                />
                            </div>

                            <div className="mt-1 text-lg font-extrabold tracking-tight text-white uppercase">
                                Sam Reginald
                                <br />
                                Besa
                            </div>

                            <div className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-white/40">
                                ICT Specialist
                                <br />
                                Fullstack Developer
                            </div>

                            <div className="absolute inset-x-0 bottom-6 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
                                Click to flip
                            </div>
                        </div>

                        <span className="pointer-events-none absolute top-3 left-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute top-3 right-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute bottom-3 left-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                        <span className="pointer-events-none absolute right-3 bottom-3 size-1.5 rounded-full bg-[#0b1220] ring-1 ring-white/10" />
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
