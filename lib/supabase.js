import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://apcowphdjghnrgbkksoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY293cGhkamdobnJnYmtrc29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0NzU3MTUsImV4cCI6MjAxMzA1MTcxNX0.Dipy4pdqswrDqAflcCh7EZ8jaPeimyCWsStO85NPQuE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
