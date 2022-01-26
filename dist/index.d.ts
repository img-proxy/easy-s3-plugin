export interface EasyS3Args {
    domain: string;
    apiKeySecret: string;
}
export interface EasyS3UploadResponse {
    s3: Record<string, string>;
    misc: {
        file_name: string;
        file_size: number;
        public_url: string;
    };
}
export declare class EasyS3 {
    private readonly domain;
    private readonly apiKeySecret;
    constructor(options: EasyS3Args);
    upload(files: File[]): Promise<{
        file_name: string;
        file_size: number;
        public_url: string;
    }[]>;
}
export default EasyS3;
