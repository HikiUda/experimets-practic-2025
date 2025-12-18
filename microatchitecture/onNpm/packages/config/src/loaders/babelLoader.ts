import webpack from 'webpack';
import { BuildOptions } from '../types/config';

export function createBabelLoader(options: BuildOptions): webpack.RuleSetRule {
    const { isDev } = options;
    return {
        test: /\.(js|jsx|ts|tsx)/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
        },
    };
}
