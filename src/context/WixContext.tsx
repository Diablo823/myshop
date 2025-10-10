// "use client";

// import { createClient, OAuthStrategy } from "@wix/sdk";
// import { products, collections } from "@wix/stores";
// import Cookies from "js-cookie";
// import { createContext, ReactNode } from "react";
// import { currentCart, checkout, backInStockNotifications } from "@wix/ecom";
// import { redirects } from "@wix/redirects";

// const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}");

// const wixClient = createClient({
//   modules: {
//     products,
//     collections,
//     currentCart,
//     checkout,
//     redirects,
//     backInStockNotifications,
//   },
//   auth: OAuthStrategy({
//     clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
//     tokens: {
//       refreshToken,
//       accessToken: {
//         value: "",
//         expiresAt: 0,
//       },
//     },
//   }),
// });

// export type WixClient = typeof wixClient;

// export const WixClientContext = createContext<WixClient>(wixClient);

// export const WixClientContextProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   return (
//     <WixClientContext.Provider value={wixClient}>
//       {children}
//     </WixClientContext.Provider>
//   );
// };

"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { currentCart, checkout, backInStockNotifications } from "@wix/ecom";
import { redirects } from "@wix/redirects";

export type WixClient = ReturnType<typeof createClient>;

export const WixClientContext = createContext<WixClient | null>(null);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  useEffect(() => {
    // Get fresh tokens on client side
    const refreshTokenCookie = Cookies.get("refreshToken");
    let refreshToken;
    
    try {
      refreshToken = refreshTokenCookie ? JSON.parse(refreshTokenCookie) : undefined;
    } catch (e) {
      console.error("Failed to parse refresh token:", e);
      refreshToken = undefined;
    }

    const client = createClient({
      modules: {
        products,
        collections,
        currentCart,
        checkout,
        redirects,
        backInStockNotifications,
      },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
        tokens: refreshToken ? {
          refreshToken,
          accessToken: {
            value: "",
            expiresAt: 0,
          },
        } : undefined,
      }),
    });

    setWixClient(client);
  }, []);

  if (!wixClient) {
    return null; // or a loading spinner
  }

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};
