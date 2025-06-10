export enum ProblemSource {
  PC = "pc",
  NETWORK = "network",
  MOBILE = "mobile",
  OTHER = "other",
}

export enum LaptopProblem {
  NO_POWER = "no-power",
  NO_DISPLAY = "no-display",
  NO_KEYBOARD = "no-keyboard",
  NO_MOUSE = "no-mouse",
  NO_AUDIO = "no-audio",
  SOFTWARE_ISSUE = "software-issue",
  OTHER = "other",
}

export enum NetworkProblem {
  NO_INTERNET = "no-internet",
  NO_WIFI = "no-wifi",
  NO_ETHERNET = "no-ethernet",
  NO_VPN = "no-vpn",
  OTHER = "other",
}

export enum MobileProblem {
  NO_SIGNAL = "no-signal",
  NO_VOICE = "no-voice",
  NO_DATA = "no-data",
  NO_CHARGING = "no-charging",
  OTHER = "other",
}

export enum OtherProblem {
  OTHER = "other",
}

export enum SoftwareIssues {
  WINDOWS_UPDATE = "windows-update",
  DRIVER_ISSUE = "driver-issue",
  APPLICATION_CRASH = "application-crash",
  VIRUS_MALWARE = "virus-malware",
  PERFORMANCE_SLOW = "performance-slow",
  STARTUP_ISSUE = "startup-issue",
  OTHER = "other",
}
