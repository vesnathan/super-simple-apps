import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/config/amplifyConfig";

// Configure Amplify on module load
Amplify.configure(amplifyConfig);
