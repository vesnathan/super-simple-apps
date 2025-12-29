/**
 * Vitest global setup file
 * Sets environment variables for all tests
 */

// Set default test environment variables
process.env.TABLE_NAME = process.env.TABLE_NAME || "test-table";
process.env.AWS_REGION = process.env.AWS_REGION || "ap-southeast-2";
process.env.NODE_ENV = "test";
process.env.STAGE = process.env.STAGE || "test";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "test-admin@example.com";
process.env.FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";

// Export empty object to satisfy TypeScript
export {};
