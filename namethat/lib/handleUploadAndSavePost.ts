"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// Removed: import { useOnchainKit } from "@coinbase/onchainkit/minikit";

const supabase = createClientComponentClient();

export async function handleUploadAndSavePost({
  file,
  caption,
  mode,
  category,
  walletAddress,
}: {
  file: File;
  caption: string;
  mode: "open" | "vote_only" | "hybrid";
  category: string;
  walletAddress: string;
}) {
  try {
    if (!walletAddress) {
      alert("Please connect your wallet.");
      return;
    }

    const filename = `${walletAddress}-${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("post_uploads")
      .upload(`user-uploads/${filename}`, file);

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      alert("Image upload failed.");
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post_uploads/${uploadData.path}`;

    const { error: insertError } = await supabase.from("posts").insert({
      wallet_address: walletAddress,
      image_url: imageUrl,
      caption,
      mode,
      category,
    });

    if (insertError) {
      console.error("Post insert failed:", insertError);
      alert("Could not save post to database.");
      return;
    }

    alert("Post uploaded successfully!");
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Something went wrong. Please try again.");
  }
}