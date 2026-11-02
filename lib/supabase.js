import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oxwypcedlwwmyoyfseua.supabase.co";
const supabaseAnonKey = "sb_publishable_Jenuc3PyqAp3YeijEj76HA_Yago-v0m";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
