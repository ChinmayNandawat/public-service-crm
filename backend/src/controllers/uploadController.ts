import { Request, Response } from 'express';
import { generateUploadUrl } from '../services/storageService';

export const getPresignedUploadUrl = async (req: any, res: Response) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    const result = await generateUploadUrl(fileName);

    res.json({
      message: 'Presigned upload URL generated successfully.',
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
    });
  } catch (error) {
    console.error('Get presigned upload URL error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
