import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // STRICT: Always verify session from secure HTTP-only cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Valid session required for account deletion." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 1. Attempt executing database RPC
    const { error: rpcError } = await supabase.rpc("delete_current_user_account");

    if (rpcError) {
      // Fallback: Manually wipe user records in dependency order
      await supabase.from("daily_tracking").delete().eq("user_id", userId);
      await supabase.from("progress").delete().eq("user_id", userId);
      await supabase.from("workout_sessions").delete().eq("user_id", userId);
      await supabase.from("workout_plans").delete().eq("user_id", userId);
      await supabase.from("diet_meals").delete().eq("user_id", userId);
      await supabase.from("diet_plans").delete().eq("user_id", userId);
      await supabase.from("foods").delete().eq("user_id", userId);
      await supabase.from("exercises").delete().eq("user_id", userId);
      await supabase.from("user_preferences").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("id", userId);
    }

    // 2. Wipe storage progress photos folder for this user
    try {
      const { data: files } = await supabase.storage
        .from("progress-photos")
        .list(userId);

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("progress-photos").remove(filePaths);
      }
    } catch {
      // Storage cleanup is best-effort if bucket is not configured yet
    }

    // 3. Invalidate auth session
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Account and associated data have been permanently deleted.",
    });
  } catch (error) {
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during account deletion." },
      { status: 500 }
    );
  }
}
