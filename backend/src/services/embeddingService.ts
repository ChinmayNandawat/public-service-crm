// Simple mock implementation for embeddings - replace with real Gemini API later
export interface ComplaintEmbedding {
  complaintId: number;
  embedding: number[];
  text: string;
}

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    // For now, generate a simple hash-based embedding
    // This is a mock implementation - replace with actual Gemini API later
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    // Create a simple word-based embedding
    words.forEach((word, index) => {
      if (index < 384) {
        embedding[index] = word.charCodeAt(0) / 255;
      }
    });
    
    return embedding;
  } catch (error) {
    console.error('Generate embedding error:', error);
    throw new Error('Failed to generate embedding');
  }
};

export const calculateCosineSimilarity = (embedding1: number[], embedding2: number[]): number => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have same dimensions');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

export const findSimilarComplaints = async (
  newComplaintText: string,
  newComplaintEmbedding: number[],
  existingComplaints: ComplaintEmbedding[]
): Promise<{ id: number; similarity: number; text: string }[]> => {
  try {
    const similarities = existingComplaints.map(complaint => ({
      id: complaint.complaintId,
      similarity: calculateCosineSimilarity(newComplaintEmbedding, complaint.embedding),
      text: complaint.text
    }));

    // Filter and sort by similarity > 0.85
    const similarComplaints = similarities
      .filter(item => item.similarity > 0.85)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3); // Return top 3 similar complaints

    return similarComplaints;
  } catch (error) {
    console.error('Find similar complaints error:', error);
    throw new Error('Failed to find similar complaints');
  }
};
