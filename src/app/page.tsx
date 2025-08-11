"use client";

import * as React from "react";
import { clusterIdeas } from "@/ai/flows/cluster-ideas";
import type { Bubble, Idea } from "@/types";
import {
  Lightbulb,
  Loader2,
  Search,
  Users,
  Inbox,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IdeaSubmissionDialog } from "@/components/idea-submission-dialog";
import { IdeaDetailSheet } from "@/components/idea-detail-sheet";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addIdea, getIdeas } from "./actions";

export default function Home() {
  const [ideas, setIdeas] = React.useState<Idea[]>([]);
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClustering, setIsClustering] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBubble, setSelectedBubble] = React.useState<Bubble | null>(null);

  React.useEffect(() => {
    async function loadIdeas() {
      setIsLoading(true);
      const fetchedIdeas = await getIdeas();
      setIdeas(fetchedIdeas);
      setIsLoading(false);
    }
    loadIdeas();
  }, []);

  React.useEffect(() => {
    async function handleClustering() {
      if (ideas.length === 0) {
        setBubbles([]);
        return;
      }
      setIsClustering(true);
      try {
        const result = await clusterIdeas({ ideas });
        const enrichedBubbles = result.bubbles.map((bubble) => ({
          ...bubble,
          ideas: bubble.ideaIds.map(id => ideas.find(idea => idea.id === id) as Idea).filter(Boolean),
        }));
        setBubbles(enrichedBubbles);
      } catch (error) {
        console.error("Failed to cluster ideas:", error);
      } finally {
        setIsClustering(false);
      }
    }
    handleClustering();
  }, [ideas]);

  const handleIdeaSubmit = async (newIdeaData: { description: string; submitterInfo: string }) => {
    try {
        const newIdea = await addIdea(newIdeaData);
        setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
    } catch (error) {
        console.error("Failed to submit idea:", error);
    }
  };

  const filteredBubbles = bubbles.filter(
    (bubble) =>
      bubble.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bubble.ideas.some((idea) =>
        idea.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const showLoadingState = isLoading || isClustering;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold tracking-tight text-primary">
            IdeaBubbles
          </h1>
        </div>
        <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ideas or bubbles..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <IdeaSubmissionDialog onIdeaSubmit={handleIdeaSubmit} />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showLoadingState ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="flex-grow">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : filteredBubbles.length > 0 ? (
            filteredBubbles.map((bubble, index) => (
              <Card
                key={index}
                className="flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => setSelectedBubble(bubble)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {isClustering ? <Loader2 className="h-6 w-6 text-primary animate-spin"/> : <Lightbulb className="h-6 w-6 text-primary" />}
                    </span>
                    <span className="flex-1">{bubble.theme}</span>
                  </CardTitle>
                   <CardDescription className="flex items-center gap-2 pt-2">
                    <Users className="h-4 w-4" />
                    <span>{bubble.ideaIds.length} ideas from {new Set(bubble.ideas.map(i => i.submitterInfo)).size} founders</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  {bubble.ideas.slice(0, 2).map(idea => (
                     <p key={idea.id} className="text-sm text-muted-foreground line-clamp-2">
                        {idea.description}
                     </p>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-24 text-center">
              <Inbox className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No ideas found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term" : "Get started by submitting an idea!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <IdeaDetailSheet
        bubble={selectedBubble}
        open={!!selectedBubble}
        onOpenChange={(open) => !open && setSelectedBubble(null)}
      />
    </div>
  );
}
