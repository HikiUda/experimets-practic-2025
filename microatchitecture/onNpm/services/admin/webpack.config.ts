import webpack from 'webpack';
import path from 'path';
import { buildWebpackConfig } from '@packages/config';
import { BuildMode, BuildPaths, EnvBuild } from '@packages/config';
import packageJson from './package.json';

export default (env: EnvBuild) => {
    const mode: BuildMode = env.mode || 'development';
    const isDev = mode === 'development';
    const PORT = env.port || 3002;

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
            name: 'admin',
            filename: 'remoteEntry.js',
            exposes: {
                './Router': './src/router/Router.tsx',
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
