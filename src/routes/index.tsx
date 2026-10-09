import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const code = useRef("");

  useEffect(() => {
    let cancel = false;
    fetch("/paliapp/index.html")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((raw) => {
        if (cancel) return;
        const doc = new DOMParser().parseFromString(raw, "text/html");
        const style = doc.querySelector("style")?.textContent ?? "";
        doc.body.querySelectorAll("script").forEach((node) => node.remove());
        const body = doc.body.innerHTML.replaceAll("laminas/", "/paliapp/laminas/");
        const script = raw.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? "";
        code.current = script
          .replaceAll("laminas/", "/paliapp/laminas/")
          .replace("register('sw.js')", "register('/paliapp/sw.js')");
        setHtml(`<style>${style}</style>${body}`);
      })
      .catch(() => {
        if (!cancel) setFailed(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!html || (window as unknown as { __paliapp?: boolean }).__paliapp) return;
    (window as unknown as { __paliapp?: boolean }).__paliapp = true;
    const node = document.createElement("script");
    node.textContent = code.current;
    document.body.appendChild(node);
  }, [html]);

  if (failed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        No se pudo abrir PALIAPP.
      </main>
    );
  }
  if (!html) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", color: "#18181b" }}>
        Cargando PALIAPP…
      </main>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
