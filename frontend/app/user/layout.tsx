// app/user/layout.tsx
import { Providers } from "@/app/providers";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}
