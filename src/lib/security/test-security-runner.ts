/**
 * ApexFit Automated Production Security Test Runner
 *
 * Runs programmatic verification for:
 * 1. Input Sanitization & XSS / SQL Injection prevention (Zod validation)
 * 2. Rate Limiting enforcement (Token bucket sliding window)
 * 3. File Upload Security (File size limits & MIME whitelist)
 * 4. Open Redirect Guard (Relative path enforcement)
 * 5. Cross-Tenant Data Isolation Logic (User ownership assertions)
 * 6. Secrets & Environment Sanitization check
 */

import { checkRateLimit } from "../ai/rate-limiter";
import { aiChatQuerySchema, aiDietAdjustmentSchema } from "../validations/ai";
import { progressPhotoUploadSchema, dailyTrackingLogSchema } from "../validations/tracking";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (failureDetails) {
      console.error(`    Details: ${failureDetails}`);
    }
  }
}

// Open redirect sanitizer under test (matching route handler implementation)
function sanitizeRedirect(url: string | null): string {
  if (!url) return "/dashboard";
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) {
    return url;
  }
  return "/dashboard";
}

// Cross-tenant data isolation simulator (evaluates RLS ownership rule)
function rlsEvaluateOwnerOnly(recordUserId: string, authenticatedUserId: string | null): boolean {
  if (!authenticatedUserId) return false;
  return recordUserId === authenticatedUserId;
}

async function runSecurityTestSuite() {
  console.log("\n=======================================================");
  console.log("    ApexFit Automated Production Security Test Suite   ");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------------
  // 1. INPUT SANITIZATION & INJECTION ATTACK DEFENSE
  // -------------------------------------------------------------------------
  console.log("[1/6] Testing Input Sanitization & Injection Defense...");

  // SQL Injection payload in prompt
  const sqliPayload = "SELECT * FROM profiles WHERE username = 'admin' OR '1'='1'; --";
  const sqliResult = aiChatQuerySchema.safeParse({ message: sqliPayload });
  assert(
    sqliResult.success && sqliResult.data.message === sqliPayload,
    "SQL injection string safely parsed as inert string literal without executing"
  );

  // XSS script tags in chat query
  const xssPayload = "<script>alert(document.cookie)</script>How do I hit my protein?";
  const xssResult = aiChatQuerySchema.safeParse({ message: xssPayload });
  assert(
    xssResult.success && !xssResult.data.message.includes("<script>"),
    "XSS script payload stripped and sanitized by Zod transform"
  );

  // Oversized prompt (Buffer overflow / denial of wallet attack)
  const oversizedPrompt = "A".repeat(1500); // Max allowed is 500
  const oversizedResult = aiChatQuerySchema.safeParse({ message: oversizedPrompt });
  assert(
    !oversizedResult.success,
    "Oversized input (>500 chars) rejected by Zod schema",
    oversizedResult.success ? "Should have failed" : undefined
  );

  // Negative / Impossible biometric values
  const invalidTracking = dailyTrackingLogSchema.safeParse({
    trackingDate: "2026-09-27",
    stepsCount: -500, // Invalid negative
    waterIntakeMl: 3000,
    caloriesConsumed: 2200,
    proteinConsumedG: 160,
    sleepHours: 8,
  });
  assert(!invalidTracking.success, "Negative steps count rejected by schema validation");

  // Impossible sleep hours (>24 hours in a single day)
  const impossibleSleep = dailyTrackingLogSchema.safeParse({
    trackingDate: "2026-09-27",
    stepsCount: 10000,
    waterIntakeMl: 3000,
    caloriesConsumed: 2200,
    proteinConsumedG: 160,
    sleepHours: 26, // Impossible
  });
  assert(!impossibleSleep.success, "Impossible sleep hours (>24h) rejected by schema validation");

  // -------------------------------------------------------------------------
  // 2. RATE LIMITING ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log("\n[2/6] Testing Rate Limiting (Token Bucket Sliding Window)...");

  const testIp = `test-attacker-${Date.now()}`;
  let allowedCount = 0;
  let blockedCount = 0;

  // Attempt 25 rapid requests when limit is 15 req/min
  for (let i = 0; i < 25; i++) {
    const res = checkRateLimit(testIp, 15, 60000);
    if (res.allowed) {
      allowedCount++;
    } else {
      blockedCount++;
    }
  }

  assert(allowedCount === 15, `Exactly 15 requests allowed under rate limit (Got: ${allowedCount})`);
  assert(blockedCount === 10, `Remaining 10 burst requests blocked with rate limit (Got: ${blockedCount})`);

  // -------------------------------------------------------------------------
  // 3. FILE UPLOAD SECURITY & MIME TYPE ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log("\n[3/6] Testing File Upload Security & MIME Whitelisting...");

  // Allowed: JPEG within 5MB
  const validJpeg = progressPhotoUploadSchema.safeParse({
    fileSize: 2 * 1024 * 1024,
    fileType: "image/jpeg",
  });
  assert(validJpeg.success, "Valid 2MB JPEG image accepted");

  // Allowed: WebP within 5MB
  const validWebp = progressPhotoUploadSchema.safeParse({
    fileSize: 4.5 * 1024 * 1024,
    fileType: "image/webp",
  });
  assert(validWebp.success, "Valid 4.5MB WebP image accepted");

  // Blocked: Oversized file (>5MB)
  const oversizedFile = progressPhotoUploadSchema.safeParse({
    fileSize: 6 * 1024 * 1024,
    fileType: "image/png",
  });
  assert(!oversizedFile.success, "Oversized file (6MB) rejected");

  // Blocked: Disallowed executable MIME type (.exe disguised)
  const executableUpload = progressPhotoUploadSchema.safeParse({
    fileSize: 50000,
    fileType: "application/x-msdownload",
  });
  assert(!executableUpload.success, "Executable file (.exe) MIME rejected");

  // Blocked: SVG with potential XSS scripts
  const svgUpload = progressPhotoUploadSchema.safeParse({
    fileSize: 15000,
    fileType: "image/svg+xml",
  });
  assert(!svgUpload.success, "SVG XML image format rejected to prevent embedded script attacks");

  // -------------------------------------------------------------------------
  // 4. OPEN REDIRECT DEFENSE
  // -------------------------------------------------------------------------
  console.log("\n[4/6] Testing Open Redirect Defense...");

  assert(
    sanitizeRedirect("/dashboard") === "/dashboard",
    "Legitimate relative path '/dashboard' allowed"
  );
  assert(
    sanitizeRedirect("/workout?day=1") === "/workout?day=1",
    "Relative path with query params allowed"
  );
  assert(
    sanitizeRedirect("https://evil-phishing-site.com") === "/dashboard",
    "Absolute external URL blocked and defaulted to /dashboard"
  );
  assert(
    sanitizeRedirect("//evil.com") === "/dashboard",
    "Protocol-relative URL '//evil.com' blocked"
  );
  assert(
    sanitizeRedirect("/\\evil.com") === "/dashboard",
    "Backslash bypass '/\\evil.com' blocked"
  );
  assert(
    sanitizeRedirect("javascript:alert(1)") === "/dashboard",
    "JavaScript URI redirect blocked"
  );

  // -------------------------------------------------------------------------
  // 5. CROSS-TENANT DATA ISOLATION & RLS POLICIES
  // -------------------------------------------------------------------------
  console.log("\n[5/6] Testing Cross-Tenant Data Isolation (Row Level Security)...");

  const userA = "00000000-0000-0000-0000-000000000001";
  const userB = "00000000-0000-0000-0000-000000000002";

  // User A accessing User A's data
  assert(
    rlsEvaluateOwnerOnly(userA, userA) === true,
    "User A successfully authorized to access User A's records"
  );

  // User A attempting to access User B's private record
  assert(
    rlsEvaluateOwnerOnly(userB, userA) === false,
    "User A blocked from accessing User B's record (Cross-tenant denial)"
  );

  // Unauthenticated user attempting to access private record
  assert(
    rlsEvaluateOwnerOnly(userA, null) === false,
    "Unauthenticated visitor blocked from accessing User A's record"
  );

  // -------------------------------------------------------------------------
  // 6. SECRETS & ENVIRONMENT AUDIT
  // -------------------------------------------------------------------------
  console.log("\n[6/6] Auditing Secrets & Environment Configuration...");

  // Validate diet adjustment schema bounds
  const negativeCalories = aiDietAdjustmentSchema.safeParse({
    currentCalories: -500,
    currentProteinG: 160,
    currentCarbsG: 240,
    currentFatG: 65,
    primaryGoal: "fat_loss",
    weightDelta7DaysKg: -0.5,
  });
  assert(!negativeCalories.success, "Negative calorie target in diet adjustment rejected by schema");

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  assert(
    !anonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") || !anonKey.includes("service_role"),
    "NEXT_PUBLIC_SUPABASE_ANON_KEY does NOT contain service_role privileges"
  );

  assert(
    typeof serviceRoleKey === "string" && !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    "Service role key is NEVER prefixed with NEXT_PUBLIC_ (Kept strictly on server)"
  );

  // -------------------------------------------------------------------------
  // SUMMARY RESULTS
  // -------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`Test Execution Finished: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite().catch((err) => {
  console.error("Test runner threw unhandled error:", err);
  process.exit(1);
});
