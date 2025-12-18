export type BuildMode = 'development' | 'production';

export interface EnvBuild {
    mode: BuildMode;
    port: number;
    MANGASITE_REMOTE_URL: string;
    ARTSITE_REMOTE_URL: string;
    apiUrl: string;
}

export interface BuildPaths {
    entry: string;
    output: string;
    public: string;
    html: string;
    src: string;
}

export interface BuildOptions {
    paths: BuildPaths;
    isDev: boolean;
    mode: BuildMode;
    port: number;
    analyzer: boolean;
    apiUrl: string;
}
