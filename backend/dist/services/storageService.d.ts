export interface PresignedUploadResponse {
    uploadUrl: string;
    fileKey: string;
}
export declare const generateUploadUrl: (fileName: string) => Promise<PresignedUploadResponse>;
export declare const generateDownloadUrl: (fileKey: string) => Promise<string>;
export declare const deleteFile: (fileKey: string) => Promise<void>;
//# sourceMappingURL=storageService.d.ts.map