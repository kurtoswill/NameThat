"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function handleUploadAndSavePost({
  file,
  caption,
  mode,
  category,
  walletAddress,
  options, // <-- add options to destructure
}: {
  file: File;
  caption: string;
  mode: "open" | "vote_only" | "hybrid";
  category: string;
  walletAddress: string;
  options?: string[]; // <-- add options type
}) {
  try {
    if (!walletAddress) {
      return { success: false, error: "Please connect your wallet." };
    }
    // Restrict vote_only or hybrid mode to at least 2 non-empty options and no empty options allowed
    let validOptions = options;
    if (mode === "vote_only" || mode === "hybrid") {
      validOptions = (options || []).map(opt => (opt ?? '').trim());
      if (validOptions.length < 2) {
        return { success: false, error: "You must provide at least 2 options for this mode." };
      }
      if (validOptions.some(opt => opt.length === 0)) {
        return { success: false, error: "All options must be filled in and not empty." };
      }
    }
    // 1. Find user_id by wallet address (optional, but keep for association)
    let user_id = null;
    if (walletAddress) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("wallet_address", walletAddress)
        .single();
      if (userError && userError.code !== 'PGRST116') { // ignore 'No rows found' error
        return { success: false, error: `User lookup failed: ${userError.message}` };
      }
      user_id = user?.id || null;
    }
    // 2. Upload image (no auth required if public policy is set)
    // Only upload image if all validation above passes
    const filename = `${walletAddress}-${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("post-uploads")
      .upload(`user-uploads/${filename}`, file, { upsert: false });
    if (uploadError) {
      return { success: false, error: `Image upload failed: ${uploadError.message}` };
    }
    if (!uploadData || !uploadData.path) {
      return { success: false, error: "Image upload failed: No path returned." };
    }
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-uploads/${uploadData.path}`;
    // 3. Insert into nfts table (no auth required if public policy is set)
    // Only insert into nfts if image upload succeeded and all validation passed
    const insertObj = {
      user_id: user_id ?? undefined,
      image_url: imageUrl,
      name: "", // Set to empty string to satisfy NOT NULL constraint
      caption,
      categories: category.split(",").map((c) => c.trim()).filter(Boolean),
      votes: 0,
      status: "new", // always set to 'new' on creation
      // submission_type: mode, // removed, not in schema
      created_at: new Date().toISOString(),
    };
    const cleanInsertObj = Object.fromEntries(Object.entries(insertObj).filter(([, value]) => value !== undefined && value !== null));
    const { data: nftInsertData, error: insertError } = await supabase.from("nfts").insert(cleanInsertObj).select("id");
    if (insertError) {
      // If NFT insert fails, delete the uploaded image to avoid orphaned files
      await supabase.storage.from("post-uploads").remove([`user-uploads/${filename}`]);
      return { success: false, error: `Could not save post to database: ${insertError.message}` };
    }
    // If vote_only or hybrid, insert suggestions into suggestions table
    if ((mode === "vote_only" || mode === "hybrid") && validOptions && validOptions.length >= 2 && nftInsertData && nftInsertData[0]?.id) {
      const nft_id = nftInsertData[0].id;
      const suggestionRows = validOptions.map((suggestion_text) => ({
        user_id: user_id ?? undefined,
        nft_id,
        suggestion_text,
        votes: 0,
        created_at: new Date().toISOString(),
      }));
      const { error: suggestionError } = await supabase.from("suggestions").insert(suggestionRows);
      if (suggestionError) {
        // If suggestions insert fails, clean up NFT and image
        await supabase.from("nfts").delete().eq("id", nft_id);
        await supabase.storage.from("post-uploads").remove([`user-uploads/${filename}`]);
        return { success: false, error: `NFT saved, but failed to save suggestions: ${suggestionError.message}` };
      }
    }
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: `Unexpected error: ${error.message}` };
    }
    return { success: false, error: `Unexpected error: ${JSON.stringify(error)}` };
  }
}