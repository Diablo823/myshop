import { getProfileData } from "./ProfileData";
import ProfileClient from "./ProfileClient";

export const revalidate = 0;

export default async function ProfilePage() {
  const profileData = await getProfileData();
  return <ProfileClient profileData={profileData} />;
}