"use client";

import { AuditVerifyClient } from "@/components/audit-verify-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";

    return <AuditVerifyClient initialId={id} />;
}

export default function VerifyPage() {
    return (
        <div className="p-8">
            <Suspense fallback={<div>Loading verify state...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
