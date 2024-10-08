import Images from "types/interface/image.interface";

export default interface ReportUserRequestDto {
    reportUserNickname: string;
    reportType: string;
    incidentDescription: string;
    incidentTimeDate: string;
    incidentLocation: string;
    impactDescription: string;
    imageList: Images[];
}