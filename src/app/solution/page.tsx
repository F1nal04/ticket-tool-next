import { Suspense } from "react";
import { getTicket } from "@/lib/actions";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SolutionPageProps {
  searchParams: Promise<{ id?: string }>;
}

async function TicketDisplay({ id }: { id: string }) {
  const ticket = await getTicket(id);

  if (!ticket) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Ticket Not Found</h2>
        <p className="text-white/70 mb-6">The ticket with ID "{id}" could not be found.</p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700">
            Create New Ticket
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ticket Details</h2>
        <p className="text-green-400 font-mono text-lg">ID: {ticket.id}</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-white font-semibold mb-2">Problem Information</h3>
          <div className="space-y-2 text-white/80">
            <p><span className="font-medium">Source:</span> {ticket.problemSource}</p>
            <p><span className="font-medium">Specific Problem:</span> {ticket.specificProblem}</p>
            {ticket.softwareIssue && (
              <p><span className="font-medium">Software Issue:</span> {ticket.softwareIssue}</p>
            )}
          </div>
        </div>

        {ticket.date && (
          <div>
            <h3 className="text-white font-semibold mb-2">Date</h3>
            <p className="text-white/80">{format(ticket.date, "PPP", { locale: de })}</p>
          </div>
        )}

        {ticket.description && (
          <div>
            <h3 className="text-white font-semibold mb-2">Description</h3>
            <p className="text-white/80 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}

        {ticket.files.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2">Attached Files</h3>
            <div className="space-y-2">
              {ticket.files.map((file, index) => (
                <div key={index} className="bg-white/5 rounded p-3">
                  <p className="text-white/80 font-medium">{file.name}</p>
                  <p className="text-white/60 text-sm">{file.type}</p>
                  {file.type.startsWith('image/') && (
                    <img 
                      src={file.base64} 
                      alt={file.name}
                      className="mt-2 max-w-full h-auto rounded border border-white/20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/20">
          <p className="text-white/60 text-sm">
            Created: {format(ticket.createdAt, "PPP 'at' p", { locale: de })}
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700">
            Create Another Ticket
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function SolutionPage({ searchParams }: SolutionPageProps) {
  const params = await searchParams;
  const id = params.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-green-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full max-w-2xl">
        {id ? (
          <Suspense fallback={<div className="text-white text-center">Loading ticket...</div>}>
            <TicketDisplay id={id} />
          </Suspense>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">No Ticket ID Provided</h2>
            <p className="text-white/70 mb-6">Please provide a valid ticket ID in the URL.</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                Create New Ticket
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}