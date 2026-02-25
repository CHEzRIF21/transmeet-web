import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: string[] = [];

  for (const [role, user] of Object.entries(TEST_USERS)) {
    const { data: listData } = await supabase.auth.admin.listUsers();
    const found = listData?.users?.find((u) => u.email === user.email);

    if (found) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        found.id,
        { password: user.password }
      );
      if (updateError) {
        results.push(`❌ ${role}: ${updateError.message}`);
      } else {
        results.push(`✅ ${role}: mot de passe réinitialisé`);
      }
      continue;
    }

    const { data: authData, error: createError } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.full_name, role: user.role },
      });

    if (createError) {
      results.push(`❌ ${role}: ${createError.message}`);
      continue;
    }

    const userId = authData.user.id;

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
      results.push(`❌ ${role} company: ${companyError.message}`);
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

    results.push(`✅ ${role} créé`);
  }

  return NextResponse.json({
    success: true,
    message: "Comptes de test créés ou réinitialisés",
    results,
    credentials: {
      expediteur: {
        email: TEST_USERS.expediteur.email,
        password: TEST_USERS.expediteur.password,
      },
      transporteur: {
        email: TEST_USERS.transporteur.email,
        password: TEST_USERS.transporteur.password,
      },
    },
  });
}
