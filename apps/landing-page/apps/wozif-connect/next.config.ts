import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["langchain", "@langchain/openai", "pdf-parse"],
};

export default nextConfig;
