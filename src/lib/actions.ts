"use server"

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCommunityThreats(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('community_threats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Server Action Error (Threats):", e);
    return [];
  }
}

export async function getUserHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('community_threats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Server Action Error (History):", e);
    return [];
  }
}

export async function getGlobalStats() {
  try {
    const { count, error } = await supabase
      .from('community_threats')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { count: count || 0 };
  } catch (e) {
    return { count: 0 };
  }
}

export async function searchRegistry(query: string) {
  try {
    const { data, error } = await supabase
      .from('community_threats')
      .select('*')
      .ilike('brand_name', `%${query}%`)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? { status: "THREAT", data: data[0] } : { status: "UNREPORTED" };
  } catch (e) {
    console.error("Server Action Error (Search):", e);
    return { status: "ERROR" };
  }
}
