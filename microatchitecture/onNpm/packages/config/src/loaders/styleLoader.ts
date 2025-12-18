import webpack from 'webpack';
import { BuildOptions } from '../types/config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function createStyleLoader(options: BuildOptions): webpack.RuleSetRule {
    const { isDev } = options;
    return {
        test: /\.s[ac]ss$/i,
        use: [
            { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath: string) => Boolean(resPath.includes('.module.')),
                        localIdentName: isDev ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:8]',
                        namedExport: false,
                    },
                },
            },
            ,
            'sass-loader',
        ],
    };
}
