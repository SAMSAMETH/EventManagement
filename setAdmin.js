import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://stinzpoderbucoawtsil.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aW56cG9kZXJidWNvYXd0c2lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ1MjgyMCwiZXhwIjoyMDc5MDI4ODIwfQ.l5O-Yi8E71ijKAbx0ecATnHZ2Qqlo0lP1tIMtpy9YSg" // not anon key
);

async function setAdmin() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    "667799e9-6b60-42df-bb65-c9b7051b7e9c", // your UID
    {
      app_metadata: { role: "admin" }
    }
  );

  console.log("DONE:", data, error);
}

setAdmin();
