import { useEffect, useRef, useState, type PointerEvent } from 'react';

export default function HangingBadge() {
    const card = useRef<HTMLDivElement>(null);
    const frame = useRef(0);
    const tilt = useRef({ x: 0, y: 0 });
    const tiltTarget = useRef({ x: 0, y: 0 });
    const flipY = useRef(0);
    const flipTarget = useRef(0);
    const pressing = useRef(false);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        const tick = () => {
            if (!pressing.current) {
                tilt.current.x += (tiltTarget.current.x - tilt.current.x) * 0.14;
                tilt.current.y += (tiltTarget.current.y - tilt.current.y) * 0.14;
            }

            flipY.current += (flipTarget.current - flipY.current) * 0.18;

            if (Math.abs(flipTarget.current - flipY.current) < 0.35) {
                flipY.current = flipTarget.current;
            }

            if (card.current) {
                const x = tilt.current.x;
                const y = flipY.current + tilt.current.y;
                card.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
            }

            frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame.current);
        };
    }, []);

    const setTiltFromEvent = (event: PointerEvent<HTMLDivElement>) => {
        if (pressing.current) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        tiltTarget.current.x = (0.5 - ny) * 16;
        tiltTarget.current.y = (nx - 0.5) * 20;
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
            <div
                className="perspective-[1200px]"
                onPointerMove={setTiltFromEvent}
                onPointerLeave={() => {
                    pressing.current = false;
                    pointerStart.current = null;
                    tiltTarget.current.x = 0;
                    tiltTarget.current.y = 0;
                }}
            >
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
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        pressing.current = true;
                        // Freeze current tilt so the card doesn't drift under the cursor
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
                    onPointerCancel={() => {
                        pressing.current = false;
                        pointerStart.current = null;
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleFlip();
                        }
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-8 top-8 h-28 bg-linear-to-b from-white/5 to-transparent" />

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

                            <div className="font-mono text-sm tracking-[0.06em] text-white/45">
                                github.com/Shashimii
                            </div>

                            <div className="absolute inset-x-0 bottom-8 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
                                Click to flip
                            </div>
                        </div>

                        <span className="pointer-events-none absolute top-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute top-5 right-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute bottom-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute right-5 bottom-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                    </div>

                    <div
                        className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-8 top-8 h-28 bg-linear-to-b from-sky/10 to-transparent" />

                        <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
                            <div className="mb-1 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-600 text-3xl font-bold text-white/70 ring-2 ring-white/15">
                                S
                            </div>

                            <div className="text-2xl font-extrabold tracking-tight text-white uppercase">
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

                        <span className="pointer-events-none absolute top-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute top-5 right-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute bottom-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                        <span className="pointer-events-none absolute right-5 bottom-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
