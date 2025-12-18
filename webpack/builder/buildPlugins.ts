import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BuildOptions } from './types/config';

export function buildPlugins(options: BuildOptions): webpack.WebpackPluginInstance[] {
    const { paths, isDev, apiUrl } = options;

    const plugins = [
        new HtmlWebpackPlugin({
            template: paths.html,
            favicon: path.resolve(paths.public, 'main.svg'),
            publicPath: '/',
        }),
        new webpack.ProgressPlugin(),

        new webpack.DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev),
            __API_URL__: JSON.stringify(apiUrl),
        }),
    ];

    if (!isDev) {
        plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(paths.public, 'locales'),
                        to: path.resolve(paths.output, 'locales'),
                    },
                ],
            }),
        );
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
            }),
        );
    }

    if (isDev) {
        plugins.push(new ReactRefreshWebpackPlugin());
        // plugins.push(
        //     new ForkTsCheckerWebpackPlugin({
        //         typescript: {
        //             diagnosticOptions: {
        //                 semantic: true,
        //                 syntactic: true,
        //             },
        //             mode: 'write-references',
        //         },
        //     }),
        // );
        //plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    if (options.analyzer) {
        plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: true }));
    }

    return plugins;
}
