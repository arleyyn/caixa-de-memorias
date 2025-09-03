import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// quais rotas proteger e qual cookie cada uma exige
const gates: Record<string, string> = {
  "/memorias/1": "memory_gate_1",
  "/memorias/2": "memory_gate_2",
  "/memorias/3": "memory_gate_3",
  "/memorias/4": "memory_gate_4",
  "/memorias/5": "memory_gate_5",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // encontra alguma rota exata que queremos proteger
  const key = Object.keys(gates).find((p) => pathname === p);
  if (!key) return NextResponse.next();

  const cookieName = gates[key];
  const hasCookie = req.cookies.get(cookieName)?.value === "1";

  if (hasCookie) return NextResponse.next();

  // bloqueado -> redireciona pra uma tela de bloqueio amigável
  const url = req.nextUrl.clone();
  url.pathname = "/bloqueado";
  url.searchParams.set("step", key.split("/").pop() || "");
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/memorias/1",
    "/memorias/2",
    "/memorias/3",
    "/memorias/4",
    "/memorias/5",
  ],
};
