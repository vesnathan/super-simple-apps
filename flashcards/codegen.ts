import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./backend/combined_schema.graphql",
  generates: {
    "./shared/src/types/gqlTypes.ts": {
      plugins: ["typescript"],
      config: {
        scalars: {
          AWSDateTime: "string",
          AWSTimestamp: "number",
        },
        enumsAsTypes: true,
        skipTypename: true,
      },
    },
  },
};

export default config;
