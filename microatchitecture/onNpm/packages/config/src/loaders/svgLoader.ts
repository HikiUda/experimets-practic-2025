import webpack from 'webpack';
import { BuildOptions } from '../types/config';

export function createSvgLoader(options: BuildOptions): webpack.RuleSetRule {
    const { isDev } = options;
    return {
        test: /\.svg$/i,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                },
                            },
                        ],
                    },
                },
            },
        ],
    };
}
