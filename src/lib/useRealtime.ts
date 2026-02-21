"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface RealtimeStats {
    type: string;
    timestamp: string;
    blocked: number;
    allowed: number;
    overridden: number;
    total: number;
    latestEvent: {
        action: string;
        verdict: string;
        score: number;
        user: string;
        time: string;
    } | null;
}

/**
 * Real-time SSE hook — subscribes to /api/events for live dashboard updates.
 */
export function useRealtime() {
    const [data, setData] = useState<RealtimeStats | null>(null);
    const [connected, setConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    const connect = useCallback(() => {
        if (typeof window === "undefined") return;

        const es = new EventSource("/api/events");
        eventSourceRef.current = es;

        es.onopen = () => setConnected(true);

        es.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                setData(parsed);
            } catch {
                // ignore parse errors
            }
        };

        es.onerror = () => {
            setConnected(false);
            es.close();
            // Reconnect after 3 seconds
            setTimeout(connect, 3000);
        };
    }, []);

    useEffect(() => {
        connect();
        return () => {
            eventSourceRef.current?.close();
        };
    }, [connect]);

    return { data, connected };
}
