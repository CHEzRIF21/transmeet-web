/**
 * Script de création des comptes de test (expéditeur + transporteur).
 * Exécuter : cd transmeet-app && npx tsx scripts/seed-test-users.ts
 * Prérequis : .env.local avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Variables requises : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = {
  expediteur: {
    email: "expediteur@test.transmeet.com",
    password: "TestExp2025!",
    full_name: "Jean Expéditeur",
    role: "expediteur" as const,
    company_name: "Logistique Cotonou SARL",
    company_country: "BEN",
  },
  transporteur: {
    email: "transporteur@test.transmeet.com",
    password: "TestTrans2025!",
    full_name: "Marie Transporteur",
    role: "transporteur" as const,
    company_name: "Trans Afrique Express",
    company_country: "BEN",
  },
};

async function seed() {
  console.log("🌱 Création des comptes de test Transmeet...\n");

  for (const [role, user] of Object.entries(TEST_USERS)) {
    const { data: listData } = await supabase.auth.admin.listUsers();
    const found = listData?.users?.find((u) => u.email === user.email);

    let userId: string;

    if (found) {
      userId = found.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: user.password }
      );
      if (updateError) {
        console.error(`❌ Erreur mise à jour mot de passe ${role}:`, updateError.message);
      } else {
        console.log(`✅ ${role} : mot de passe réinitialisé (${user.email})`);
      }
      continue;
    }

    const { data: authData, error: createError } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      });

    if (createError) {
      console.error(`❌ Erreur création ${role}:`, createError.message);
      continue;
    }

    userId = authData.user.id;

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: user.company_name,
        type: user.role,
        country: user.company_country,
      })
      .select("id")
      .single();

    if (companyError) {
      console.error(`❌ Erreur company ${role}:`, companyError.message);
      continue;
    }

    await supabase
      .from("profiles")
      .update({
        full_name: user.full_name,
        role: user.role,
        company_id: company.id,
      })
      .eq("id", userId);

    if (user.role === "expediteur") {
      await supabase.from("shippers").insert({
        user_id: userId,
        company_id: company.id,
      });
    } else {
      await supabase.from("transporters").insert({
        user_id: userId,
        company_id: company.id,
      });
    }

    console.log(`✅ ${role} créé : ${user.email}`);
  }

  console.log("\n📋 DONNÉES DE CONNEXION POUR TESTS\n");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│ EXPÉDITEUR                                                    │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log(`│ Email    : ${TEST_USERS.expediteur.email.padEnd(43)}│`);
  console.log(`│ Mot de passe : ${TEST_USERS.expediteur.password.padEnd(36)}│`);
  console.log("└─────────────────────────────────────────────────────────────┘\n");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│ TRANSPORTEUR                                                 │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log(`│ Email    : ${TEST_USERS.transporteur.email.padEnd(43)}│`);
  console.log(`│ Mot de passe : ${TEST_USERS.transporteur.password.padEnd(36)}│`);
  console.log("└─────────────────────────────────────────────────────────────┘\n");
  console.log("🔗 Connexion : http://localhost:3001/login\n");
}

seed().catch(console.error);
