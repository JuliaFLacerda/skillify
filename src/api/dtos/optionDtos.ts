// src/api/admin/dtos/optionDtos.ts

export interface OptionResponseDTO {
  id: string;
  title: string;
  correct: boolean;
}

export interface OptionCreateDTO{
  questionId : string;
  title : string;
  correct : boolean;
}