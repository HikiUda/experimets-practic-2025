import { Configuration } from 'webpack-dev-server';
import { BuildOptions } from './types/config';

export function buildDevServer(options: BuildOptions): Configuration {
    return {
        port: options.port,
        historyApiFallback: true,
        open: true,
        hot: true,
    };
}
