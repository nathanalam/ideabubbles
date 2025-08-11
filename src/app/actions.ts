'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Idea } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function getIdeas(): Promise<Idea[]> {
  try {
    const ideasSnapshot = await adminDb.collection('ideas').orderBy('createdAt', 'desc').get();
    const ideas: Idea[] = ideasSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        description: data.description,
        submitterInfo: data.submitterInfo,
        // Timestamps need to be handled carefully across server/client boundaries.
        // For this case, we'll send a serializable version.
        createdAt: data.createdAt.toDate(),
      } as unknown as Idea;
    });
    return ideas;
  } catch (error) {
    console.error("Error getting ideas from Firestore:", error);
    // In case of an error, return an empty array to prevent the app from crashing.
    return [];
  }
}

export async function addIdea(ideaData: { description: string; submitterInfo: string }): Promise<Idea> {
    try {
        const newIdeaRef = adminDb.collection('ideas').doc();
        const newIdea = {
            ...ideaData,
            id: newIdeaRef.id,
            createdAt: FieldValue.serverTimestamp(),
        };
        await newIdeaRef.set(newIdea);

        // Fetch the just-created document to get the server-generated timestamp
        const doc = await newIdeaRef.get();
        const data = doc.data()!;

        return {
            id: doc.id,
            description: data.description,
            submitterInfo: data.submitterInfo,
            createdAt: data.createdAt.toDate(),
        } as unknown as Idea;
    } catch (error) {
        console.error("Error adding idea to Firestore:", error);
        // Re-throw the error to be handled by the calling function
        throw new Error("Failed to add idea. Please try again.");
    }
}
