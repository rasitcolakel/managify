import { authProvider } from "src/authProvider";
import { Profile } from "src/types";
import { supabaseClient } from "src/utility";
import { v4 as uuidv4 } from "uuid";

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

export const updateMyProfileImage = async (
  profile: Profile,
  image: File
): Promise<boolean> => {
  const user: any = await authProvider.getIdentity();
  const photoID = `avatars/${user.id}-${uuidv4()}`;
  const { error } = await supabaseClient.storage
    .from("avatars")
    .upload(photoID, image);
  if (error) {
    throw error;
  }
  const { data } = await supabaseClient
    .from("profiles")
    .update({ avatar: photoID })
    .eq("id", user.id)
    .select();
  if (data) {
    return true;
  }
  return false;
};

export const getImage = (imagePath: string) => {
  const { data } = supabaseClient.storage
    .from("avatars")
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

export const getImageFromCDN = (imagePath: string) => {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${imagePath}`;
};
