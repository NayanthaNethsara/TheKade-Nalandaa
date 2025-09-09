import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function useAutoLogout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const expires = session.user.accessTokenExpires;
    const now = Date.now();

    if (now > expires) {
      signOut({ callbackUrl: "/login" }); // clears session cookie
    }

    // Optional: auto-logout exactly when token expires
    const timeout = setTimeout(
      () => signOut({ callbackUrl: "/login" }),
      expires - now
    );

    return () => clearTimeout(timeout);
  }, [session]);
}
