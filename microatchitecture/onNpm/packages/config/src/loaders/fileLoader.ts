import webpack from 'webpack';
import { BuildOptions } from '../types/config';

export function createFileLoader(options: BuildOptions): webpack.RuleSetRule {
    const { isDev } = options;
    return {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    };
}
