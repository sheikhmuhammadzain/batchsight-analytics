"use client";

import { useEffect, useState, useRef } from "react";

const TASK_SEQUENCES = [
    {
        status: "Analyzing batch data",
        lines: [
            "Connecting to Berger database...",
            "Fetching formula records...",
            "Loading batch processing data...",
            "Analyzing cost variances...",
            "Calculating ingredient deviations...",
        ],
    },
    {
        status: "Processing formulas",
        lines: [
            "Scanning formula compositions...",
            "Comparing standard vs actual costs...",
            "Identifying excess ingredients...",
            "Detecting unused materials...",
            "Calculating variance percentages...",
            "Analyzing batch touchpoints...",
            "Aggregating production metrics...",
            "Finalizing formula analysis...",
        ],
    },
    {
        status: "Generating insights",
        lines: [
            "Initializing AI analysis engine...",
            "Processing manufacturing trends...",
            "Evaluating cost optimization opportunities...",
            "Identifying top variance drivers...",
            "Analyzing ingredient usage patterns...",
            "Generating recommendations...",
            "Validating data accuracy...",
            "Preparing response...",
            "Finalizing insights...",
        ],
    },
];

const LoadingAnimation = ({ progress }: { progress: number }) => (
    <div className="relative w-6 h-6">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label={`Loading progress: ${Math.round(progress)}%`}
        >
            <title>Loading Progress Indicator</title>

            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="16"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle
                    r="150"
                    cx="120"
                    cy="120"
                    stroke="#FF2E7E"
                    opacity="0.95"
                />
                <circle
                    r="130"
                    cx="120"
                    cy="120"
                    stroke="#00E5FF"
                    opacity="0.95"
                />
                <circle
                    r="110"
                    cx="120"
                    cy="120"
                    stroke="#4ADE80"
                    opacity="0.95"
                />
                <circle
                    r="90"
                    cx="120"
                    cy="120"
                    stroke="#FFA726"
                    opacity="0.95"
                />
                <circle
                    r="70"
                    cx="120"
                    cy="120"
                    stroke="#FFEB3B"
                    opacity="0.95"
                />
                <circle
                    r="50"
                    cx="120"
                    cy="120"
                    stroke="#FF4081"
                    opacity="0.95"
                />
            </g>
        </svg>
    </div>
);

export default function AILoadingState() {
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [visibleLines, setVisibleLines] = useState<
        Array<{ text: string; number: number }>
    >([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineHeight = 28;

    const currentSequence = TASK_SEQUENCES[sequenceIndex];
    const totalLines = currentSequence.lines.length;

    useEffect(() => {
        const initialLines = [];
        for (let i = 0; i < Math.min(5, totalLines); i++) {
            initialLines.push({
                text: currentSequence.lines[i],
                number: i + 1,
            });
        }
        setVisibleLines(initialLines);
        setScrollPosition(0);
    }, [sequenceIndex, currentSequence.lines, totalLines]);

    // Handle line advancement
    useEffect(() => {
        const advanceTimer = setInterval(() => {
            // Get the current first visible line index
            const firstVisibleLineIndex = Math.floor(
                scrollPosition / lineHeight
            );
            const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

            // If we're about to wrap around, move to next sequence
            if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
                setSequenceIndex(
                    (prevIndex) => (prevIndex + 1) % TASK_SEQUENCES.length
                );
                return;
            }

            // Add the next line if needed
            if (
                nextLineIndex >= visibleLines.length &&
                nextLineIndex < totalLines
            ) {
                setVisibleLines((prevLines) => [
                    ...prevLines,
                    {
                        text: currentSequence.lines[nextLineIndex],
                        number: nextLineIndex + 1,
                    },
                ]);
            }

            // Scroll to the next line
            setScrollPosition((prevPosition) => prevPosition + lineHeight);
        }, 2000);

        return () => clearInterval(advanceTimer);
    }, [
        scrollPosition,
        visibleLines,
        totalLines,
        sequenceIndex,
        currentSequence.lines,
        lineHeight,
    ]);

    // Apply scroll position
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    return (
        <div className="flex items-center justify-start w-full py-2">
            <div className="space-y-4 w-full max-w-md">
                <div className="ml-2 flex items-center space-x-2 text-gray-600 dark:text-gray-300 font-medium">
                    <LoadingAnimation
                        progress={(sequenceIndex / TASK_SEQUENCES.length) * 100}
                    />
                    <span className="text-sm">{currentSequence.status}...</span>
                </div>

                <div className="relative">
                    <div
                        ref={codeContainerRef}
                        className="font-mono text-xs overflow-hidden w-full h-[84px] relative rounded-lg bg-muted/30"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <div>
                            {visibleLines.map((line) => (
                                <div
                                    key={`${line.number}-${line.text}`}
                                    className="flex h-[28px] items-center px-2"
                                >
                                    <div className="text-gray-400 dark:text-gray-500 pr-3 select-none w-6 text-right">
                                        {line.number}
                                    </div>

                                    <div className="text-gray-800 dark:text-gray-200 flex-1 ml-1">
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none rounded-lg"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 30%, transparent 100%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
