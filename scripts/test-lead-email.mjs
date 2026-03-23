/**
 * Test d'envoi d'une lead (équivalent formulaire Contact).
 * Prérequis : Next.js sur localhost:3000 avec .env.local (RESEND_*, LEADS_EMAIL).
 * Pour success: true : lancer aussi l'API sur :4000 avec DATABASE_URL dans apps/api/.env
 */
const url = process.env.LEAD_TEST_URL ?? "http://localhost:3000/api/leads";

const body = JSON.stringify({
  type: "CONTACT",
  name: "Test script Node",
  email: "script-test@example.com",
  phone: "+2290162681683",
  subject: "Test automatique — scripts/test-lead-email.mjs",
  message:
    "Si ce message arrive sur LEADS_EMAIL, Resend fonctionne. Si success:true, la base aussi.",
});

console.log("POST", url);

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body,
});

const data = await res.json().catch(() => ({}));
console.log(JSON.stringify(data, null, 2));

if (res.ok && data.success) {
  console.log("\nOK — Vérifiez la boîte LEADS_EMAIL et Admin > Leads.");
  process.exit(0);
}

process.exit(1);
