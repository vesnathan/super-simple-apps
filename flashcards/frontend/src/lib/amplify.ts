import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { amplifyConfig } from "@/config/amplifyConfig";

// Configure Amplify on module load
Amplify.configure(amplifyConfig);

// Export a pre-configured GraphQL client
export const graphqlClient = generateClient();
