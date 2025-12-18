import webpack from 'webpack';
import { BuildOptions } from './types/config';

import { createBabelLoaderTs, createBabelLoaderTsx } from './loaders/babelLoader';
// import { createTsLoader } from './loaders/tsLoader';
import { createStyleLoader } from './loaders/styleLoader';
import { createSvgLoader } from './loaders/svgLoader';
import { createFileLoader } from './loaders/fileLoader';

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
    //const tsLoader = createTsLoader(options);
    const babelLoaderTs = createBabelLoaderTs(options);
    const babelLoaderTsx = createBabelLoaderTsx(options);
    const styleLoader = createStyleLoader(options);
    const svgLoader = createSvgLoader(options);
    const fileLoader = createFileLoader(options);

    return [fileLoader, svgLoader, babelLoaderTs, babelLoaderTsx, styleLoader];
}
