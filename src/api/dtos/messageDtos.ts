// src/api/dtos/messageDtos.ts
import { UserResponseDTO } from './userDtos';

export interface MessageResponseDTO {
  remetente: UserResponseDTO;
  destinatario: UserResponseDTO;
  content: string;
}

export interface MessageCreateDTO {
  remetenteId: string;
  destinatarioId: string;
  content: string;
}