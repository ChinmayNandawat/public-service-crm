import { Request, Response } from 'express';
declare const loadComplaintsData: (req: Request, res: Response, next: any) => void;
export declare const getPredictions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { loadComplaintsData };
//# sourceMappingURL=predictionController.d.ts.map