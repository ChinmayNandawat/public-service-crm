import { Request, Response } from 'express';
declare const loadComplaintsData: (req: Request, res: Response, next: any) => void;
export declare const analyzeWithCopilot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { loadComplaintsData };
//# sourceMappingURL=copilotController.d.ts.map