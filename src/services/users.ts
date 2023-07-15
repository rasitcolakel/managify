import { authProvider } from "src/authProvider";
import { Profile } from "src/types";
import { supabaseClient } from "src/utility";

export const getMyProfile = async (): Promise<Profile> => {
  const user: any = await authProvider.getIdentity();

  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
};

export const updateMyProfile = async (profile: Profile): Promise<boolean> => {
  const user: any = await authProvider.getIdentity();

  const { error } = await supabaseClient
    .from("profiles")
    .update(profile)
    .eq("id", user.id);
  if (error) {
    throw error;
  }
  return true;
};
