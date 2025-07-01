"use client";

import { useEffect, useState } from "react";
import { getTicket, generateTicketSolution, deleteTicket } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Ticket } from "@/types/ticket";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

function TicketDisplay({ id }: { id: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await getTicket(id);
        setTicket(ticketData);
        if (ticketData) {
          generateSolution();
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const generateSolution = async () => {
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const { output } = await generateTicketSolution(id);
      
      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAiResponse(prev => prev + delta);
        }
      }
    } catch (error) {
      console.error('Error generating solution:', error);
      setAiResponse('Error generating solution. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleNewTicket = async () => {
    await deleteTicket(id);
    router.push('/');
  };

  const handleMoreHelp = () => {
    router.push(`/submit?id=${id}`);
  };

  if (loading) {
    return <div className="text-white text-center">Loading ticket...</div>;
  }

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
        <h2 className="text-2xl font-bold text-white mb-2">AI Solution</h2>
        <p className="text-green-400 font-mono text-lg">Ticket ID: {ticket.id}</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          AI Solution
          {aiLoading && (
            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h3>
        <div className="text-white/80 prose prose-invert max-w-none">
          {aiResponse ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-medium text-white mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-white/80 mb-3 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside text-white/80 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-white/80 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-white/80">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-white/90">{children}</em>,
                code: ({ children }) => <code className="bg-white/10 px-2 py-1 rounded text-green-300 font-mono text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto mb-3">{children}</pre>,
              }}
            >
              {aiResponse}
            </ReactMarkdown>
          ) : (
            <p>{aiLoading ? "Generating solution..." : "Click to generate solution"}</p>
          )}
        </div>
        {!aiResponse && !aiLoading && (
          <Button 
            onClick={generateSolution}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Generate Solution
          </Button>
        )}
        {aiResponse && !aiLoading && (
          <Button 
            onClick={generateSolution}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Regenerate Solution
          </Button>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Button 
          onClick={handleNewTicket}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Another Ticket
        </Button>
        <Button 
          onClick={handleMoreHelp}
          className="bg-blue-600 hover:bg-blue-700"
        >
          More Help Needed
        </Button>
      </div>
    </div>
  );
}

export default function SolutionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-green-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full max-w-2xl">
        {id ? (
          <TicketDisplay id={id} />
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