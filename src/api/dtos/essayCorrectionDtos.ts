// src/api/admin/dtos/essayCorrectionDtos.ts
import { EssayResponseDTO } from './essayDtos';
import { UserResponseDTO } from './userDtos';
import { EssayExecutionResponseDTO } from './essayExecutionDtos';

export enum EssayConquest {
  ARGUMENTACAO_SOLIDA = "ARGUMENTACAO_SOLIDA",
  COESAO_PERFEITA = "COESAO_PERFEITA",
  VOCABULARIO_RICO = "VOCABULARIO_RICO"
}

export interface EssayCorrectionCreateDTO {
  essayId: string;
  mentorId: string;
  essayExecutionId: string;
  estruturaCoesaoComentario: string;
  argumentacaoComentario: string;
  conquistas: EssayConquest[]
  competencia1Score: number;
  competencia2Score: number;
  competencia3Score: number;
  competencia4Score: number;
  competencia5Score: number;
}

export interface EssayCorrectionResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  essay: EssayResponseDTO;
  mentor: UserResponseDTO;
  essayExecution: EssayExecutionResponseDTO;
  estruturaCoesaoComentario: string;
  argumentacaoComentario: string;
  conquistas: EssayConquest[]
  competencia1Score: number;
  competencia2Score: number;
  competencia3Score: number;
  competencia4Score: number;
  competencia5Score: number;
}