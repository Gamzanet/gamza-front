// @ts-check
import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";

const nextConfig = (
  phase: string,
  { defaultConfig }: { defaultConfig: NextConfig }
): NextConfig => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...defaultConfig,
      target: "server",
      env: {
        API_URL: "http://localhost:3000",
      },
    };
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      ...defaultConfig,
      target: "server",
      env: {
        API_URL: "https://yourdomain.com",
      },
    };
  }

  return defaultConfig;
};

export default nextConfig;
