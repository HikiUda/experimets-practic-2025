import webpack from 'webpack';
import path from 'path';
import { buildWebpackConfig } from '@packages/config';
import { BuildMode, BuildPaths, EnvBuild } from '@packages/config';
import packageJson from './package.json';

export default (env: EnvBuild) => {
    const mode: BuildMode = env.mode || 'development';
    const isDev = mode === 'development';
    const PORT = env.port || 3000;

    const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL || 'http://localhost:3001';
    const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL || 'http://localhost:3002';

    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'build'),
        public: path.resolve(__dirname, 'public'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const config: webpack.Configuration = buildWebpackConfig({
        paths,
        isDev,
        mode,
        port: PORT,
    });

    config.plugins?.push(
        new webpack.container.ModuleFederationPlugin({
            name: 'host',
            filename: 'remoteEntry.js',
            remotes: {
                shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
                admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
            },
            shared: {
                ...packageJson.dependencies,
                react: {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react'],
                },
                'react-router-dom': {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'],
                },
                'react-dom': {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
            },
        }),
    );

    return config;
};
