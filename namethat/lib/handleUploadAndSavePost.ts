"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// Removed: import { useOnchainKit } from "@coinbase/onchainkit/minikit";

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClientComponentClient();

// Diagnostic: List all buckets at runtime
supabase.storage.listBuckets().then(({ data, error }) => {
  if (error) {
    console.error('Error listing buckets:', error);
  } else {
    console.log('Supabase buckets visible to this client:', data?.map(b => b.name));
  }
});

export async function handleUploadAndSavePost({
  imageUrl, // now expects a string URL
  caption,
  mode,
  categories,
  walletAddress,
}: {
  imageUrl: string; // changed from file: File to imageUrl: string
  caption: string;
  mode: "open" | "vote_only" | "hybrid";
  categories: string[];
  walletAddress: string;
}): Promise<{ error?: string } | void> {
  try {
    if (!walletAddress) {
      return { error: "Please connect your wallet." };
    }
    if (!imageUrl) {
      return { error: "Please select an image URL." };
    }
    // Directly insert the image URL into the nfts table
    const { error: insertError } = await supabase.from("nfts").insert({
      user_id: walletAddress,
      image_url: imageUrl,
      name: null, // Name is null, to be voted on later
      caption,
      categories,
      votes: 0,
      status: 'public',
      submission_type: mode,
    });
    if (insertError) {
      console.error("NFT insert failed:", insertError);
      return { error: insertError.message || "Could not save NFT to database." };
    }
    // Success, no error
    return;
  } catch (e) {
    console.error("Unexpected error:", e);
    return { error: (e instanceof Error ? e.message : "Something went wrong. Please try again.") };
  }
}