"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ProblemSource,
  LaptopProblem,
  NetworkProblem,
  MobileProblem,
  OtherProblem,
  SoftwareIssues,
} from "@/types/enums";

const problemLabels: Record<string, string> = {
  // Problem Sources
  [ProblemSource.PC]: "PC",
  [ProblemSource.NETWORK]: "Netzwerk",
  [ProblemSource.MOBILE]: "Mobile",
  [ProblemSource.OTHER]: "Andere",
  // Mobile Problems
  [MobileProblem.NO_SIGNAL]: "Kein Signal",
  [MobileProblem.NO_VOICE]: "Keine Stimme",
  [MobileProblem.NO_DATA]: "Keine Daten",
  [MobileProblem.NO_CHARGING]: "Lädt nicht",
  // Laptop Problems
  [LaptopProblem.NO_POWER]: "Kein Strom",
  [LaptopProblem.NO_DISPLAY]: "Kein Display",
  [LaptopProblem.NO_KEYBOARD]: "Keine Tastatur",
  [LaptopProblem.NO_MOUSE]: "Keine Maus",
  [LaptopProblem.NO_AUDIO]: "Kein Audio",
  [LaptopProblem.SOFTWARE_ISSUE]: "Software Problem",
  // Network Problems
  [NetworkProblem.NO_INTERNET]: "Kein Internet",
  [NetworkProblem.NO_WIFI]: "Kein WLAN",
  [NetworkProblem.NO_ETHERNET]: "Kein Ethernet",
  [NetworkProblem.NO_VPN]: "Kein VPN",
  // Software Issues
  [SoftwareIssues.WINDOWS_UPDATE]: "Windows Update",
  [SoftwareIssues.DRIVER_ISSUE]: "Treiber Problem",
  [SoftwareIssues.APPLICATION_CRASH]: "Anwendung Absturz",
  [SoftwareIssues.VIRUS_MALWARE]: "Virus/Malware",
  [SoftwareIssues.PERFORMANCE_SLOW]: "Langsame Leistung",
  [SoftwareIssues.STARTUP_ISSUE]: "Startproblem",
};

export default function Home() {
  const [problemSource, setProblemSource] = useState<string>("");
  const [specificProblem, setSpecificProblem] = useState<string>("");
  const [softwareIssue, setSoftwareIssue] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const getSecondSelectOptions = () => {
    switch (problemSource) {
      case ProblemSource.PC:
        return Object.values(LaptopProblem).map((problem) => ({
          value: problem,
          label: problemLabels[problem] || problem,
        }));
      case ProblemSource.NETWORK:
        return Object.values(NetworkProblem).map((problem) => ({
          value: problem,
          label: problemLabels[problem] || problem,
        }));
      case ProblemSource.MOBILE:
        return Object.values(MobileProblem).map((problem) => ({
          value: problem,
          label: problemLabels[problem] || problem,
        }));
      case ProblemSource.OTHER:
        return Object.values(OtherProblem).map((problem) => ({
          value: problem,
          label: problemLabels[problem] || problem,
        }));
      default:
        return [];
    }
  };

  const handleProblemSourceChange = (value: string) => {
    setProblemSource(value);
    setSpecificProblem("");
  };

  const handleSpecificProblemChange = (value: string) => {
    setSpecificProblem(value);
    if (value !== LaptopProblem.SOFTWARE_ISSUE) {
      setSoftwareIssue("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-green-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Ticket Form
        </h1>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">
              Problem Source
            </label>
            <Select onValueChange={handleProblemSourceChange}>
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select problem source" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProblemSource).map((source) => (
                  <SelectItem key={source} value={source}>
                    {problemLabels[source] || source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">
              Specific Problem
            </label>
            <Select
              disabled={!problemSource}
              onValueChange={handleSpecificProblemChange}
              value={specificProblem}
            >
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white disabled:opacity-50">
                <SelectValue placeholder="Select specific problem" />
              </SelectTrigger>
              <SelectContent>
                {getSecondSelectOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">
              Software Issue
            </label>
            <Select
              disabled={specificProblem !== LaptopProblem.SOFTWARE_ISSUE}
              value={softwareIssue}
              onValueChange={setSoftwareIssue}
            >
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white disabled:opacity-50">
                <SelectValue placeholder="Select software issue" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SoftwareIssues).map((issue) => (
                  <SelectItem key={issue} value={issue}>
                    {problemLabels[issue] || issue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30",
                    !date && "text-white/70"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: de })
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    const day = date.getDay();
                    return day === 0 || day === 6; // Disable Sunday (0) and Saturday (6)
                  }}
                  weekStartsOn={1}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Pictures</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="w-full bg-white/20 border-white/30 text-white file:bg-transparent file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 hover:bg-white/30"
              onChange={(e) => setFiles(e.target.files || undefined)}
            />
            {files && files.length > 0 && (
              <div className="text-white/70 text-sm">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
