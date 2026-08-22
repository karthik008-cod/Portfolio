import type { Metadata } from "next";
import 'react-quill/dist/quill.snow.css';

export const metadata: Metadata = {
  title: "Portfolio Admin",
  description: "Manage your portfolio content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
