import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import { orders } from "@wix/ecom";

export type Order = orders.Order;
export type OrderLineItem = orders.OrderLineItem;

export type Address = {
  _id: string;
  addressLine: string;
  city: string;
  subdivision: string;
  country: string;
  postalCode: string;
};

export type ProfileData = {
  isAuthenticated: boolean;
  member: members.Member | null;
  initialOrders: Order[];
  nextCursor: string | null;
};

export async function getProfileData(): Promise<ProfileData> {
  const wixClient = await wixClientServer();
  let isAuthenticated = false;
  let member: members.Member | null = null;
  let initialOrders: Order[] = [];
  let nextCursor: string | null = null;

  try {
    isAuthenticated = await wixClient.auth.loggedIn();
    
    if (isAuthenticated) {
      const memberResponse = await wixClient.members.getCurrentMember({
        fieldsets: [members.Set.FULL],
      });
      
      member = memberResponse.member ?? null;
      
      if (member?.contactId) {
        const orderResponse = await wixClient.orders.searchOrders({
          search: {
            filter: { "buyerInfo.contactId": { $eq: member.contactId } },
            cursorPaging: {
              limit: 5,
            },
          },
        });
        
        initialOrders = orderResponse.orders || [];
        nextCursor = orderResponse.metadata?.cursors?.next || null;
      }
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    isAuthenticated = false;
  }

  return {
    isAuthenticated,
    member,
    initialOrders,
    nextCursor,
  };
}