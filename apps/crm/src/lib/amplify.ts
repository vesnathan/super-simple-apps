"use client";

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/config/amplifyConfig";

Amplify.configure(amplifyConfig, { ssr: true });

export { Amplify };
