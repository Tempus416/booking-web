"use client";
import { useEffect, useState } from "react";

export default function MePage() {
  const [session, setSession] = useState<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(setSession).catch(console.error);
  }, []);

  async function callApi() {
    setApiError(null); setApiResult(null);
    try {
      const token = session?.accessToken;
      if (!token) { setApiError("No accessToken in session. Sign in first."); return; }
      const res = await fetch("http://localhost:3002/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      try { setApiResult(JSON.parse(text)); } catch { setApiResult(text); }
      if (!res.ok) setApiError(`API returned ${res.status}`);
    } catch (e:any) { setApiError(e?.message ?? "Request failed"); }
  }

  async function callDebug() {
    setDebugError(null); setDebugResult(null);
    try {
      const token = session?.accessToken;
      if (!token) { setDebugError("No accessToken in session. Sign in first."); return; }
      const res = await fetch("http://localhost:3002/debug/echo-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      try { setDebugResult(JSON.parse(text)); } catch { setDebugResult(text); }
      if (!res.ok) setDebugError(`Debug returned ${res.status}`);
    } catch (e:any) { setDebugError(e?.message ?? "Request failed"); }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>/me</h1>
      <p>
        <a href="/api/auth/signin?callbackUrl=/me">Sign in</a> ·{" "}
        <a href="/api/auth/signout?callbackUrl=/me">Sign out</a>
      </p>

      <h3>Session</h3>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <button onClick={callApi} style={{ padding: 8, marginRight: 8 }}>Call API (/me)</button>
      <button onClick={callDebug} style={{ padding: 8 }}>Call Debug (/debug/echo-auth)</button>

      {apiError && <p style={{ color: "crimson" }}>API Error: {apiError}</p>}
      {apiResult && (<><h3>API Response</h3><pre>{JSON.stringify(apiResult, null, 2)}</pre></>)}

      {debugError && <p style={{ color: "crimson" }}>Debug Error: {debugError}</p>}
      {debugResult && (<><h3>Debug Response</h3><pre>{JSON.stringify(debugResult, null, 2)}</pre></>)}
    </div>
  );
}
