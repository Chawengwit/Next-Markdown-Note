import { getCurrentUser } from "@/app/lip/server/auth";

export default async function Page() {
    const user = await getCurrentUser();

    return (
        <div className="overflow-auto max-h-screen p-2 flex-none w-1/3">
            <div className="m-2">Signed in as: {user.email}</div>
        </div>
    );
}