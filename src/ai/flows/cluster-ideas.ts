'use server';
/**
 * @fileOverview This file contains the Genkit flow for clustering startup ideas into thematic bubbles.
 *
 * - clusterIdeas - A function that clusters a list of startup ideas into thematic bubbles.
 * - ClusterIdeasInput - The input type for the clusterIdeas function.
 * - ClusterIdeasOutput - The return type for the clusterIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaSchema = z.object({
  id: z.string(),
  description: z.string().describe('The description of the startup idea.'),
  submitterInfo: z.string().describe('The contact information of the submitter.'),
});

const ClusterIdeasInputSchema = z.object({
  ideas: z.array(IdeaSchema).describe('A list of startup ideas to cluster.'),
});
export type ClusterIdeasInput = z.infer<typeof ClusterIdeasInputSchema>;

const BubbleSchema = z.object({
  theme: z.string().describe('A representative summary of the clustered ideas.'),
  ideaIds: z.array(z.string()).describe('The IDs of the ideas within this bubble.'),
});

const ClusterIdeasOutputSchema = z.object({
  bubbles: z.array(BubbleSchema).describe('A list of thematic bubbles, each containing similar ideas.'),
});
export type ClusterIdeasOutput = z.infer<typeof ClusterIdeasOutputSchema>;

export async function clusterIdeas(input: ClusterIdeasInput): Promise<ClusterIdeasOutput> {
  return clusterIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clusterIdeasPrompt',
  input: {schema: ClusterIdeasInputSchema},
  output: {schema: ClusterIdeasOutputSchema},
  prompt: `You are an expert in identifying common themes in startup ideas.

  Given the following list of startup ideas, group them into thematic bubbles. Each bubble should have a representative summary that captures the essence of the ideas within it. Provide the bubble along with a list of idea Ids that were clustered into the given bubble.

  Ideas:
  {{#each ideas}}
  Id: {{{id}}}
  Description: {{{description}}}
  Submitter Info: {{{submitterInfo}}}
  {{/each}}
  `,
});

const clusterIdeasFlow = ai.defineFlow(
  {
    name: 'clusterIdeasFlow',
    inputSchema: ClusterIdeasInputSchema,
    outputSchema: ClusterIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
