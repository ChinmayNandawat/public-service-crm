import { Response } from 'express';
export declare const createComplaint: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getComplaints: (req: any, res: Response) => Promise<void>;
export declare const getComplaintById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateComplaint: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteComplaint: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const triggerSLAEscalation: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=complaintController.d.ts.map