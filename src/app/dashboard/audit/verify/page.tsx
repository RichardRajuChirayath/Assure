import { AuditVerifyClient } from "@/components/audit-verify-client";

export const metadata = {
    title: "Verify Integrity | Assure",
    description: "Verify your audit logs on the blockchain.",
};

export default function VerifyPage() {
    return (
        <div className="p-8">
            <AuditVerifyClient />
        </div>
    );
}
