// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

export interface Payload {
  type: string;
  table: "teamMembers";
  record: TeamMembersRecord;
  schema: string;
  old_record: any;
}

export interface TeamMembersRecord {
  id: number;
  status: string;
  team_id: number;
  user_id: string;
  created_at: string;
  created_by: any;
  updated_at: string;
  invitation_id: string;
}

type Email = {
  to: string;
  subject: string;
  html: string;
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const APP_URL = Deno.env.get("NEXT_PUBLIC_BASE_URL") ?? "";

const invitationEmail = (teamName: string, invitationId: string) => {
  return `
  <p>You have been invited to ${teamName} on Managify</p>
  <p>Click <a href="${APP_URL}invitations/${invitationId}">here</a> to join the team</p>
  `;
};

async function sendEmail({ to, subject, html }: Email) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Managify <managify@rasit.me>",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

// eslint-disable-next-line no-unused-vars
serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const payload = (await req.json()) as Payload;
    console.log("payload", JSON.stringify(payload, null, 2));

    if (payload.record.status !== "invited") {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    const record = payload.record;
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", record.user_id)
      .single();
    console.log("profile", JSON.stringify(profile, null, 2));

    const { data: team, error } = await supabaseClient
      .from("teams")
      .select("*")
      .eq("id", record.team_id)
      .single();
    if (error) throw error;
    console.log("team", JSON.stringify(team, null, 2));
    // Send email
    const emailResp = await sendEmail({
      to: profile?.email,
      subject: "You have been invited to join a team - Managify",
      html: invitationEmail(team.title, record.invitation_id),
    });

    console.log("emailResp", JSON.stringify(emailResp, null, 2));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
