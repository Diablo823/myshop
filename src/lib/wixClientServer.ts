import { orders, recommendations } from "@wix/ecom";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { cookies } from "next/headers";
import { members } from '@wix/members';

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = cookies();
    refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
  } catch (error) {
    console.log(error);
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
      recommendations
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken: {
          value: "",
          expiresAt: 0,
        },
      },
    }),
  });

  return wixClient;
};