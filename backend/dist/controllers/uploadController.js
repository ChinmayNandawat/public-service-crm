"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUploadUrl = void 0;
const storageService_1 = require("../services/storageService");
const getPresignedUploadUrl = async (req, res) => {
    try {
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).json({ error: 'fileName is required' });
        }
        const result = await (0, storageService_1.generateUploadUrl)(fileName);
        res.json({
            message: 'Presigned upload URL generated successfully.',
            uploadUrl: result.uploadUrl,
            fileKey: result.fileKey,
        });
    }
    catch (error) {
        console.error('Get presigned upload URL error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.getPresignedUploadUrl = getPresignedUploadUrl;
//# sourceMappingURL=uploadController.js.map