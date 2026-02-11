import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Bug,
  Zap,
  Package,
} from "lucide-react";
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandTelegram,
  IconDownload,
} from "@tabler/icons-react";
import { useIsMobile } from "@/hook/use-mobile";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Mock changelog data
const changelogData = [
  {
    version: "1.1.0",
    date: "February 11, 2026",
    status: "latest",
    changes: [
      {
        type: "feature",
        title: "New Analytics Dashboard",
        description:
          "Introduced comprehensive analytics with real-time metrics and custom reports.",
        icon: Sparkles,
      },
      {
        type: "feature",
        title: "Dark Mode Support",
        description:
          "Added system-wide dark mode with automatic theme switching.",
        icon: Zap,
      },
      {
        type: "improvement",
        title: "Performance Optimization",
        description:
          "Reduced initial load time by 40% through code splitting and lazy loading.",
        icon: Zap,
      },
      {
        type: "fix",
        title: "Fixed Login Issues",
        description:
          "Resolved authentication errors affecting users with special characters in passwords.",
        icon: Bug,
      },
    ],
  },
  {
    version: "1.0.5",
    date: "February 4, 2026",
    status: "stable",
    changes: [
      {
        type: "feature",
        title: "Export to PDF",
        description:
          "Users can now export their data and reports in PDF format.",
        icon: Package,
      },
      {
        type: "fix",
        title: "Mobile Responsiveness",
        description: "Fixed layout issues on tablets and mobile devices.",
        icon: Bug,
      },
      {
        type: "improvement",
        title: "Enhanced Security",
        description:
          "Implemented two-factor authentication and improved session management.",
        icon: CheckCheck,
      },
    ],
  },
  {
    version: "1.0.0",
    date: "January 28, 2026",
    status: "stable",
    changes: [
      {
        type: "feature",
        title: "Official Launch",
        description:
          "Initial public release with core features and functionality.",
        icon: Sparkles,
      },
      {
        type: "feature",
        title: "User Authentication",
        description:
          "Secure login and registration system with email verification.",
        icon: Check,
      },
      {
        type: "feature",
        title: "Dashboard Interface",
        description: "Clean and intuitive dashboard for managing your account.",
        icon: Package,
      },
    ],
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "improvement":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "fix":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "feature":
      return "New";
    case "improvement":
      return "Improved";
    case "fix":
      return "Fixed";
    default:
      return type;
  }
};

export default function ChangeLogs() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="border-0! h-[95vh] sm:h-screen sm:max-w-md">
        <DrawerHeader className="p-4 bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-end justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">
                What's New
              </DrawerTitle>
              <DrawerDescription className="text-sm mt-1">
                Track our latest updates and improvements
              </DrawerDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />v{changelogData[0].version}
            </Badge>
          </div>
        </DrawerHeader>

        <div className="flex-1 space-y-6 p-4 overflow-auto custom-scrollbar">
          {changelogData.map((release, idx) => (
            <div key={release.version} className="space-y-3">
              {/* Version Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">
                    v{release.version}
                  </h3>
                  {release.status === "latest" && (
                    <Badge variant="default" className="text-xs">
                      Latest
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {release.date}
                </span>
              </div>

              {/* Changes List */}
              <div className="space-y-3">
                {release.changes.map((change, changeIdx) => {
                  const Icon = change.icon;
                  return (
                    <div
                      key={changeIdx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-md h-fit ${getTypeColor(change.type)}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getTypeColor(change.type)} border-0`}
                          >
                            {getTypeLabel(change.type)}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{change.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Separator between versions */}
              {idx < changelogData.length - 1 && (
                <Separator className="my-6 bg-border" />
              )}
            </div>
          ))}
        </div>

        <DrawerFooter className="flex-col! gap-6 border-t">
          <div className="flex gap-3 items-center text-sm text-muted-foreground">
            <Separator className="flex-1 bg-border" />
            Visit us for more updates
            <Separator className="flex-1 bg-border" />
          </div>
          <div className="flex justify-center items-center gap-6">
            <Link
              scroll={false}
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#165ec9] transition-colors"
            >
              <IconBrandFacebook size={24} />
            </Link>

            <Link
              scroll={false}
              href="https://t.me/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#0088cc] text-white hover:bg-[#007ab8] transition-colors"
            >
              <IconBrandTelegram size={24} />
            </Link>

            <Link
              scroll={false}
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
            >
              <IconBrandDiscord size={24} />
            </Link>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
