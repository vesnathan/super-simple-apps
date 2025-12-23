import fs from "fs";
import path from "path";

const SCHEMA_DIR = path.join(__dirname, "../schema");
const OUTPUT_FILE = path.join(__dirname, "../combined_schema.graphql");

// Read all GraphQL files
const files = fs
  .readdirSync(SCHEMA_DIR)
  .filter((f) => f.endsWith(".graphql"))
  .sort(); // Sort so 00-schema.graphql comes first

const queryFields: string[] = [];
const mutationFields: string[] = [];
const subscriptionFields: string[] = [];
const otherContent: string[] = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(SCHEMA_DIR, file), "utf-8");
  const lines = content.split("\n");

  let inQuery = false;
  let inMutation = false;
  let inSubscription = false;
  let currentBlock: string[] = [];

  for (const line of lines) {
    // Check if we're entering a type extension
    if (line.trim().startsWith("extend type Query")) {
      inQuery = true;
      continue;
    } else if (line.trim().startsWith("extend type Mutation")) {
      inMutation = true;
      continue;
    } else if (line.trim().startsWith("extend type Subscription")) {
      inSubscription = true;
      continue;
    }

    // Check if we're entering the base type definition
    if (
      line.trim() === "type Query {" ||
      line.trim() === "type Mutation {" ||
      line.trim() === "type Subscription {"
    ) {
      inQuery = line.includes("Query");
      inMutation = line.includes("Mutation");
      inSubscription = line.includes("Subscription");
      continue;
    }

    // Check if we're closing a block
    if (line.trim() === "}" && (inQuery || inMutation || inSubscription)) {
      if (inQuery) queryFields.push(...currentBlock);
      if (inMutation) mutationFields.push(...currentBlock);
      if (inSubscription) subscriptionFields.push(...currentBlock);

      currentBlock = [];
      inQuery = false;
      inMutation = false;
      inSubscription = false;
      continue;
    }

    // Collect lines within a block
    if (inQuery || inMutation || inSubscription) {
      // Skip placeholder comments and empty fields
      if (
        line.trim() &&
        line.trim() !== "_empty: String" &&
        !line.trim().startsWith("# Placeholder")
      ) {
        currentBlock.push(line);
      }
    } else {
      // Collect all other content (types, inputs, enums, etc.)
      if (line.trim() || otherContent.length > 0) {
        otherContent.push(line);
      }
    }
  }
}

// Build the final schema
const finalSchema: string[] = [];

// Add all type definitions, inputs, enums FIRST (before Query/Mutation/Subscription)
// This ensures all types are defined before they're referenced
finalSchema.push(...otherContent);
finalSchema.push("");

// Add Query type
finalSchema.push("type Query {");
if (queryFields.length > 0) {
  finalSchema.push(...queryFields);
} else {
  finalSchema.push("  _empty: String");
}
finalSchema.push("}");
finalSchema.push("");

// Add Mutation type
finalSchema.push("type Mutation {");
if (mutationFields.length > 0) {
  finalSchema.push(...mutationFields);
} else {
  finalSchema.push("  _empty: String");
}
finalSchema.push("}");
finalSchema.push("");

// Add Subscription type (optional - only if there are subscriptions)
if (subscriptionFields.length > 0) {
  finalSchema.push("type Subscription {");
  finalSchema.push(...subscriptionFields);
  finalSchema.push("}");
}

// Write the output
fs.writeFileSync(OUTPUT_FILE, finalSchema.join("\n"), "utf-8");

// eslint-disable-next-line no-console
console.log(`Merged schema written to ${OUTPUT_FILE}`);
// eslint-disable-next-line no-console
console.log(
  `   Query fields: ${queryFields.filter((l) => l.trim() && !l.trim().startsWith("@")).length}`,
);
// eslint-disable-next-line no-console
console.log(
  `   Mutation fields: ${mutationFields.filter((l) => l.trim() && !l.trim().startsWith("@")).length}`,
);
