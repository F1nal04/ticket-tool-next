"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { storage } from "./storage";
import { Ticket, TicketFile } from "@/types/ticket";
import { createStreamableValue } from "ai/rsc";
import { generateSolution } from "./ai";

export async function saveTicket(formData: FormData) {
  const id = nanoid(8);
  
  const problemSource = formData.get("problemSource") as string;
  const specificProblem = formData.get("specificProblem") as string;
  const softwareIssue = formData.get("softwareIssue") as string;
  const dateStr = formData.get("date") as string;
  const description = formData.get("description") as string;
  const filesData = formData.get("files") as string;
  
  const files: TicketFile[] = filesData ? JSON.parse(filesData) : [];
  
  const ticket: Ticket = {
    id,
    problemSource,
    specificProblem,
    softwareIssue: softwareIssue || undefined,
    date: dateStr ? new Date(dateStr) : undefined,
    files,
    description,
    createdAt: new Date(),
  };
  
  storage.set(id, JSON.stringify(ticket));
  console.log('Ticket saved with ID:', id);
  console.log('Storage has ticket:', storage.has(id));
  
  redirect(`/solution?id=${id}`);
}

export async function getTicket(id: string): Promise<Ticket | null> {
  console.log('Getting ticket with ID:', id);
  console.log('All storage keys:', (storage as any).getAllKeys());
  console.log('Storage has ticket:', storage.has(id));
  
  const ticketData = storage.get(id);
  if (!ticketData) {
    console.log('No ticket data found for ID:', id);
    return null;
  }
  
  const ticket = JSON.parse(ticketData) as Ticket;
  ticket.date = ticket.date ? new Date(ticket.date) : undefined;
  ticket.createdAt = new Date(ticket.createdAt);
  
  console.log('Retrieved ticket:', ticket);
  return ticket;
}

export async function generateTicketSolution(ticketId: string) {
  const ticket = await getTicket(ticketId);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  
  const stream = createStreamableValue('');
  
  (async () => {
    const result = await generateSolution(ticket);
    
    for await (const delta of result.textStream) {
      stream.update(delta);
    }
    
    stream.done();
  })();
  
  return { output: stream.value };
}

export async function deleteTicket(ticketId: string) {
  const deleted = storage.delete(ticketId);
  console.log(`Ticket ${ticketId} deleted: ${deleted}`);
  return deleted;
}