import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="bg-yellow-300 p-2 text-center font-bold text-black">Markdown App</h1>
      <div>
        <Link href="/signup" className="bg-red-700 p-2 text-center block text-white px-6 py-2">Sign up</Link>
      </div>
      <div>
        <Link href="/login" className="bg-blue-700 p2 text-center block text-white px-6 py-2">Log in</Link>
      </div>
    </div>
  );
}
