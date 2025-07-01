"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-green-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Thank You for Your Submission
          </h1>
          {id && (
            <p className="text-green-400 font-mono text-lg mb-4">
              Ticket ID: {id}
            </p>
          )}
        </div>

        <div className="space-y-4 text-white/80 mb-8">
          <p>
            Your request for additional help has been submitted successfully.
          </p>
          <p>
            Our support team will review your ticket and get back to you as soon as possible.
          </p>
          <p className="text-sm text-white/60">
            Please keep your ticket ID for reference.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Create New Ticket
          </Button>
        </Link>
      </div>
    </div>
  );
}