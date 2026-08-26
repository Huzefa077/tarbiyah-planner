"use client";

// Shared delayed loader for page changes and slow user actions.
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";

type PageLoaderContextValue = {
    startLoading: () => void;
    stopLoading: () => void;
};

const PageLoaderContext = createContext<PageLoaderContextValue | null>(null);

export function PageLoaderProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [loadingPath, setLoadingPath] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clear both timers before starting a new load or hiding the loader.
    const clearTimers = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }

        if (safetyTimer.current) {
            clearTimeout(safetyTimer.current);
            safetyTimer.current = null;
        }
    }, []);

    const stopLoading = useCallback(() => {
        clearTimers();
        setIsVisible(false);
        setLoadingPath(null);
    }, [clearTimers]);

    // Wait 300ms before showing anything, so quick actions do not flash a loader.
    const startLoading = useCallback(() => {
        clearTimers();

        setLoadingPath(window.location.pathname);

        timer.current = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        /*
        A failed browser navigation has no success callback for us to use.
        This last-resort timeout prevents a visual loader from trapping the
        user forever if the network request fails.
        */
        safetyTimer.current = setTimeout(() => {
            stopLoading();
        }, 15_000);
    }, [clearTimers, stopLoading]);

    // A changed URL means the navigation completed, so remove the previous loader state.
    useEffect(() => {
        clearTimers();

        // Scheduling avoids updating React state directly inside this effect.
        const stopTimer = window.setTimeout(stopLoading, 0);

        return () => {
            window.clearTimeout(stopTimer);
        };
    }, [pathname, clearTimers, stopLoading]);

    // Browser Back/Forward uses popstate rather than a regular link click.
    useEffect(() => {
        window.addEventListener("popstate", stopLoading);

        return () => {
            window.removeEventListener("popstate", stopLoading);
        };
    }, [stopLoading]);

    // This catches normal Next.js <Link> navigation across the app.
    useEffect(() => {
        function handleInternalLinkClick(event: MouseEvent) {
            if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;

            if (!(target instanceof Element)) return;

            const link = target.closest("a");

            if (
                !link ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            ) {
                return;
            }

            const destination = new URL(link.href, window.location.origin);

            if (
                destination.origin !== window.location.origin ||
                // API routes may redirect to an external provider, so they need a normal browser navigation.
                destination.pathname.startsWith("/api/") ||
                (destination.pathname === window.location.pathname &&
                    destination.search === window.location.search)
            ) {
                return;
            }

            startLoading();
        }

        document.addEventListener("click", handleInternalLinkClick);

        return () => {
            document.removeEventListener("click", handleInternalLinkClick);
        };
    }, [startLoading]);

    // Do not leave a timer running if the provider ever unmounts.
    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    return (
        <PageLoaderContext.Provider value={{ startLoading, stopLoading }}>
            {children}

            {isVisible && loadingPath === pathname && (
                <div
                    aria-live="polite"
                    className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm"
                    role="status"
                >
                    <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-3 shadow-lg">
                        <span
                            aria-hidden="true"
                            className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"
                        />

                        <span className="text-sm font-medium">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
        </PageLoaderContext.Provider>
    );
}

// Client components call this before a router.push() or a slow API request.
export function usePageLoader() {
    const context = useContext(PageLoaderContext);

    if (!context) {
        throw new Error("usePageLoader must be used inside PageLoaderProvider");
    }

    return context;
}
