import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://stinzpoderbucoawtsil.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aW56cG9kZXJidWNvYXd0c2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTI4MjAsImV4cCI6MjA3OTAyODgyMH0.4t1TspjXqSdxTBwPeSm2q83xGY9UmHbhmasbTVziMvg"
);
