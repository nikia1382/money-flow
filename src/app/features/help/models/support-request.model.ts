export interface CreateSupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SupportStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportRequestResponse {
  id: number;
  status: SupportStatus;
  createdAt: string;
}