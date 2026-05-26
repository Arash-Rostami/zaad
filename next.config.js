/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /README\.md$/,
            })
        );
        return config;
    },
};

module.exports = nextConfig;