import { useEffect, useRef } from 'react';

export default function HangingBadge() {
    const card = useRef<HTMLDivElement>(null);
    const frame = useRef(0);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * 0.12;
            current.current.y += (target.current.y - current.current.y) * 0.12;

            if (card.current) {
                card.current.style.transform = `rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`;
            }

            frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame.current);
        };
    }, []);

    return (
        <div className="flex items-start justify-center">
            <div
                className="perspective-[1000px]"
                onPointerMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const nx = (event.clientX - rect.left) / rect.width;
                    const ny = (event.clientY - rect.top) / rect.height;
                    target.current.x = (0.5 - ny) * 18;
                    target.current.y = (nx - 0.5) * 22;
                }}
                onPointerLeave={() => {
                    target.current.x = 0;
                    target.current.y = 0;
                }}
            >
                <div
                    ref={card}
                    className="relative h-[28rem] w-[21rem] origin-center rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_rgba(0,0,0,0.55)] will-change-transform"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute inset-x-8 top-8 h-28 bg-linear-to-b from-white/5 to-transparent" />

                    <div className="relative flex h-full flex-col items-center px-8 pt-14 pb-8">
                        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-600 text-3xl font-bold text-white/70 ring-2 ring-white/15">
                            S
                        </div>

                        <div className="text-center text-2xl font-extrabold tracking-tight text-white uppercase">
                            Sam Reginald
                            <br />
                            Besa
                        </div>

                        <div className="mt-3 font-mono text-xs tracking-[0.08em] text-white/40">
                            ID SDEV-2026
                        </div>

                        <div className="mt-auto flex w-full justify-between gap-4">
                            <div>
                                <div className="font-mono text-[10px] tracking-[0.08em] text-white/30 uppercase">
                                    Department
                                </div>
                                <div className="text-sm font-bold text-white/75 uppercase">
                                    Fullstack
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-[10px] tracking-[0.08em] text-white/30 uppercase">
                                    Position
                                </div>
                                <div className="text-sm font-bold text-white/75 uppercase">
                                    Developer
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className="absolute top-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                    <span className="absolute top-5 right-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                    <span className="absolute bottom-5 left-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                    <span className="absolute right-5 bottom-5 size-2.5 rounded-full bg-slate-500 ring-1 ring-slate-300/40" />
                </div>
            </div>
        </div>
    );
}
