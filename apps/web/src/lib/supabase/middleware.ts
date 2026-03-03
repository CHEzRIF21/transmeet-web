import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuth = !!user;
  const isAuthRoute =
    request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register" ||
    request.nextUrl.pathname.startsWith("/register/verify");
  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    ["/expediteur", "/transporteur", "/admin", "/shared"].some((p) =>
      request.nextUrl.pathname.startsWith(p)
    );

  if (isDashboard && !isAuth) {
    const redirect = new URL("/login", request.url);
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }
  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
