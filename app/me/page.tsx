"use client";

import { useEffect, useState } from "react";

export default function MePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>/me</h1>
      <p>
        <a href="/api/auth/signin?callbackUrl=/me">Sign in</a> ·{" "}
        <a href="/api/auth/signout?callbackUrl=/me">Sign out</a>
      </p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
