// Summarize-bubble.ts
'use server';
/**
 * @fileOverview Summarizes the core concept of a group of ideas (an "idea bubble").
 *
 * - summarizeBubble - A function that takes a list of idea descriptions and returns a concise summary of the core concept.
 * - SummarizeBubbleInput - The input type for the summarizeBubble function, an array of idea descriptions.
 * - SummarizeBubbleOutput - The return type for the summarizeBubble function, a string summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBubbleInputSchema = z.array(z.string().describe('Idea Description'));
export type SummarizeBubbleInput = z.infer<typeof SummarizeBubbleInputSchema>;

const SummarizeBubbleOutputSchema = z.string().describe('Concise summary of the core concept of the grouped ideas.');
export type SummarizeBubbleOutput = z.infer<typeof SummarizeBubbleOutputSchema>;

export async function summarizeBubble(input: SummarizeBubbleInput): Promise<SummarizeBubbleOutput> {
  return summarizeBubbleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBubblePrompt',
  input: {schema: z.object({ideas: SummarizeBubbleInputSchema})},
  output: {schema: SummarizeBubbleOutputSchema},
  prompt: `You are an expert at summarizing ideas.
  Given the following list of idea descriptions, create a concise summary that captures the core concept that unites them.  The summary should be one short paragraph.

  {{#each ideas}}
  - {{this}}
  {{/each}}
  `,
});

const summarizeBubbleFlow = ai.defineFlow(
  {
    name: 'summarizeBubbleFlow',
    inputSchema: SummarizeBubbleInputSchema,
    outputSchema: SummarizeBubbleOutputSchema,
  },
  async input => {
    //Need to convert the input array to a format that Handlebars can use
    const ideas = input;
    const {output} = await prompt({ideas});
    return output!;
  }
);
