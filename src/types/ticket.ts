export interface TicketFile {
  name: string;
  base64: string;
  type: string;
}

export interface Ticket {
  id: string;
  problemSource: string;
  specificProblem: string;
  softwareIssue?: string;
  date?: Date;
  files: TicketFile[];
  description: string;
  createdAt: Date;
}