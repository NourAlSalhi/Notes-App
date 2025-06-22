import "./globals.css";
import { Toaster } from "@/lib/react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
        <Toaster position="bottom-left"/>
      </body>
    </html>
  );
}
