import webpack from 'webpack';
import { BuildOptions } from '../types/config';
import { babelRemovePropsPlugin } from '../babel/babelRemovePropsPlugin';

interface BuildBabelLoaderOptions extends BuildOptions {
    isTsx?: boolean;
}

export function createBabelLoader(options: BuildBabelLoaderOptions): webpack.RuleSetRule {
    const { isDev, isTsx } = options;
    return {
        test: /\.(js|jsx|ts|tsx)/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env'],
                plugins: [
                    ['@babel/plugin-transform-typescript', { isTsx }],
                    '@babel/plugin-transform-runtime',
                    !isDev && isTsx && [babelRemovePropsPlugin, { props: ['data-testid'] }],
                    isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
            },
        },
    };
}

export const createBabelLoaderTsx = (options: BuildOptions) =>
    createBabelLoader({ ...options, isTsx: true });
export const createBabelLoaderTs = (options: BuildOptions) =>
    createBabelLoader({ ...options, isTsx: false });
