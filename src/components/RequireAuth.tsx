import { syncSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "allowed" | "blocked">("checking");

  useEffect(() => {
    let active = true;

    const verify = async () => {
      const email = await syncSession();
      if (!active) return;
      setStatus(email ? "allowed" : "blocked");
    };

    void verify();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-soft px-4">
        <div className="rounded-2xl border border-border bg-background px-6 py-4 text-sm text-muted-foreground shadow-soft">
          Checking your session...
        </div>
      </div>
    );
  }

  if (status === "blocked") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
};

export default RequireAuth;
