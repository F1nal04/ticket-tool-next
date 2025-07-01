"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { storage } from "./storage";
import { Ticket, TicketFile } from "@/types/ticket";

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
  
  redirect(`/solution?id=${id}`);
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const ticketData = storage.get(id);
  if (!ticketData) return null;
  
  const ticket = JSON.parse(ticketData) as Ticket;
  ticket.date = ticket.date ? new Date(ticket.date) : undefined;
  ticket.createdAt = new Date(ticket.createdAt);
  
  return ticket;
}