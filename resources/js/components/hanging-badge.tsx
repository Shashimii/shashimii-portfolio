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

                        <div className="pointer-events-none relative flex h-full flex-col items-center px-8 pt-14 pb-8">
                            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-600 text-3xl font-bold text-white/70 ring-2 ring-white/15">
                                S
                            </div>

                            <div className="text-center text-2xl font-extrabold tracking-tight text-white uppercase">
                                Sam Reginald
                                <br />
                                Besa
                            </div>

                            <div className="mt-3 text-center font-mono text-xs leading-relaxed tracking-[0.08em] text-white/40">
                                ICT Specialist
                                <br />
                                Fullstack Developer
                            </div>

                            <div className="mt-auto font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
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
                            <div className="font-mono text-[11px] tracking-[0.16em] text-sky uppercase">
                                Stack
                            </div>
                            <div className="space-y-2 text-lg font-semibold tracking-tight text-white">
                                <p>Laravel</p>
                                <p>React</p>
                                <p>Inertia</p>
                            </div>
                            <div className="mt-4 max-w-[14rem] font-mono text-xs leading-relaxed text-white/45">
                                Creating web apps and websites for business.
                            </div>
                            <div className="mt-2 font-mono text-[10px] tracking-[0.14em] text-white/25 uppercase">
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
