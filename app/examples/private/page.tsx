import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { isDemoAuthEnabled } from "@/features/auth/server/demo-mode";
import {
  DEMO_SESSION_COOKIE_NAME,
  verifyDemoSessionToken,
} from "@/features/auth/server/demo-session";
import { getDemoSessionSecret } from "@/utils/env.server";

export default async function PrivateExamplePage() {
  if (!isDemoAuthEnabled()) notFound();
  const token = (await cookies()).get(DEMO_SESSION_COOKIE_NAME)?.value;
  if (!token || !(await verifyDemoSessionToken(token, { secret: getDemoSessionSecret() })))
    redirect("/login");
  return (
    <main id={MAIN_CONTENT_ID} className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">Demo session verified</h1>
      <p className="text-muted">
        This local example demonstrates a protected page. It does not authenticate a real user.
      </p>
      <Link className="text-brand underline" href="/examples">
        Return to examples
      </Link>
    </main>
  );
}
