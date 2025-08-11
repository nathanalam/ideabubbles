"use client";

import type { Bubble } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail } from "lucide-react";
import { Badge } from "./ui/badge";

interface IdeaDetailSheetProps {
  bubble: Bubble | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaDetailSheet({ bubble, open, onOpenChange }: IdeaDetailSheetProps) {
  if (!bubble) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-bold">{bubble.theme}</SheetTitle>
          <SheetDescription>
            A closer look at the ideas in this cluster. Connect with founders and bring these ideas to life!
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6 space-y-4">
            {bubble.ideas.map((idea) => (
              <Card key={idea.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">{idea.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Submitted by:</span>
                    <a href={`mailto:${idea.submitterInfo}`} className="text-primary hover:underline flex items-center gap-1">
                      <Mail className="h-4 w-4"/>
                      <span>{idea.submitterInfo}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
