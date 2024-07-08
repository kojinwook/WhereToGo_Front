import ResponseDto from "../response.dto";

export default interface GetAverageRateResponseDto extends ResponseDto{
    average:  Record<string, number>;
}