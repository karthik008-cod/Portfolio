import type { Metadata } from "next";

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
