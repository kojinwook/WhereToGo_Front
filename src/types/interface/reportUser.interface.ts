import { Images } from "./interface";

export default interface ReportUser {
    reportId: number;
    userNickname: string;
    reportUserNickname: string;
    reportType: string;
    incidentDescription: string;
    incidentTimeDate: string;
    incidentLocation: string;
    impactDescription: string;
    reportDate: string;
    imageList: Images[]
};
