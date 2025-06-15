import Link from "next/link";
import SignUpForm from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Rigester to Notes App
        </h2>
        <SignUpForm/>
        <p className="text-sm text-center mt-4 text-gray-600 ">
         Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
