/** Raw row from Supabase `orders` + relations. */
export interface SupabaseOrderRow {
  id: string;
  order_number: string | null;
  product_id: string;
  quantity: number;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  postscript?: string | null;
  status: string;
  user_id: string;
  created_at: string;
  products?: { name: string } | { name: string }[] | null;
  profiles?: ProfileJoin | ProfileJoin[] | null;
}

export interface ProfileJoin {
  company_name: string | null;
  email: string | null;
}
