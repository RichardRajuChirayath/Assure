export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h2 className="text-4xl font-black mb-4">404 - Not Found</h2>
            <p className="text-muted">The safety intelligence for this page is missing.</p>
            <a href="/" className="mt-8 text-primary hover:underline">Return Home</a>
        </div>
    );
}
