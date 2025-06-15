import Link from "next/link";
import SignInForm from "../components/SignInForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Login to Notes App
        </h2>
        <SignInForm />
        <p className="text-sm text-center mt-4 text-gray-600 ">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
