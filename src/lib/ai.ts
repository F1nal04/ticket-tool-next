import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Ticket } from '@/types/ticket';

export function createPromptFromTicket(ticket: Ticket): string {
  const prompt = `
You are an IT support specialist. Analyze the following ticket and provide a detailed solution.

Ticket Details:
- ID: ${ticket.id}
- Problem Source: ${ticket.problemSource}
- Specific Problem: ${ticket.specificProblem}
${ticket.softwareIssue ? `- Software Issue: ${ticket.softwareIssue}` : ''}
${ticket.date ? `- Date: ${ticket.date.toLocaleDateString()}` : ''}
${ticket.description ? `- Description: ${ticket.description}` : ''}
${ticket.files.length > 0 ? `- Attached Files: ${ticket.files.length} file(s)` : ''}

Please provide:
1. A brief analysis of the problem
2. Step-by-step troubleshooting instructions
3. Potential causes
4. Prevention tips

Keep the response professional and easy to follow.
`;

  return prompt.trim();
}

export async function generateSolution(ticket: Ticket) {
  const prompt = createPromptFromTicket(ticket);
  
  const result = streamText({
    model: google('gemini-1.5-flash'),
    prompt,
    temperature: 0.7,
    maxTokens: 1000,
  });

  return result;
}