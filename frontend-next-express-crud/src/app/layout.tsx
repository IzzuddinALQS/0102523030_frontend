import "./globals.css";

export const metadata = {
  title: "Frontend Next.js CRUD",
  description: "Frontend Next.js untuk Express CRUD API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
