export type BuildMode = 'development' | 'production';

export interface EnvBuild {
    mode: BuildMode;
    port: number;
    SHOP_REMOTE_URL?: string;
    ADMIN_REMOTE_URL?: string;
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
}
