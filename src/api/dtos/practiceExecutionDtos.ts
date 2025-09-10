import { PracticeResponseDTO } from "./practiceDtos";
import { OptionResponseDTO } from "./questionDtos";
import { UserResponseDTO } from "./userDtos";

export interface PracticeExecutionResponseDTO {
    id:string;
    student: UserResponseDTO;
    practice: PracticeResponseDTO;
    selectedAnswers: Set<OptionResponseDTO>;
    correctAnswers: number;
    duration? : number;
}


export interface PracticeExecutionCreateDTO {
    studentId: string;
    practiceId: string;
    selectedAnswerIds: string[];
    correctAnswers: number;
    duration? : number;
}