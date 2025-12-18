import webpack from 'webpack';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import { BuildOptions } from '../types/config';

export function createTsLoader(options: BuildOptions): webpack.RuleSetRule {
    const { isDev } = options;
    return {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: isDev,
                    getCustomTransformers: () => ({
                        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                },
            },
        ],
        exclude: /node_modules/,
    };
}
