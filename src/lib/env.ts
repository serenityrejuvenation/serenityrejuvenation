// Environment variable validation
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
} as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`[Env] Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  }

  // Log MongoDB connection info in development
  if (process.env.NODE_ENV === "development" && process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log(`[Env] MongoDB host: ${dbUrl.hostname}`);
    console.log(`[Env] MongoDB port: ${dbUrl.port || "default"}`);

    // Check if connection string has optimal settings
    const params = dbUrl.searchParams;
    if (!params.has('retryWrites')) {
      console.warn('[Env] MongoDB connection missing "retryWrites=true" - adding it can improve reliability');
    }
    if (!params.has('serverSelectionTimeoutMS')) {
      console.warn('[Env] MongoDB connection missing "serverSelectionTimeoutMS" - adding it can prevent hangs');
    }
    if (!params.has('connectTimeoutMS')) {
      console.warn('[Env] MongoDB connection missing "connectTimeoutMS" - adding it can prevent hangs');
    }
  }
}

// Validate on import in development
if (process.env.NODE_ENV === "development") {
  validateEnv();
}
