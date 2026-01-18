/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['pg', '@prisma/client'],
};

export default nextConfig;
