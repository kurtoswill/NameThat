"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function handleUploadAndSavePost({
  file,
  caption,
  mode,
  category,
  walletAddress,
  options,
}: {
  file: File;
  caption: string;
  mode: "open_suggestion" | "vote_only" | "hybrid";
  category: string;
  walletAddress: string;
  options?: string[];
}) {
  try {
    if (!walletAddress) {
      return { success: false, error: "Please connect your wallet." };
    }
    // Validate options...
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

    // 1. Find user_id and username by wallet address
    let user_id = null;
    if (walletAddress) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .eq("wallet_address", walletAddress)
        .single();
      if (userError && userError.code !== 'PGRST116') {
        return { success: false, error: `User lookup failed: ${userError.message}` };
      }
      user_id = user?.id || null;
    }

    // 2. Upload image
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

    // 3. Insert into nfts table
    const insertObj = {
      user_id: user_id ?? undefined,
      image_url: imageUrl,
      name: "",
      caption,
      categories: Array.isArray(category)
        ? category
        : category.split(",").map((c) => c.trim()).filter(Boolean),
      votes: 0,
      status: "new",
      submission_type: mode,
      created_at: new Date().toISOString(),
    };
    const cleanInsertObj = Object.fromEntries(Object.entries(insertObj).filter(([, value]) => value !== undefined && value !== null));
    const { data: nftInsertData, error: insertError } = await supabase.from("nfts").insert(cleanInsertObj).select("id");
    if (insertError || !nftInsertData || !nftInsertData[0]?.id) {
      await supabase.storage.from("post-uploads").remove([`user-uploads/${filename}`]);
      return { success: false, error: `Could not save post to database: ${insertError ? insertError.message : 'Unknown error'}` };
    }

    // 4. Insert suggestions if needed...
    if ((mode === "vote_only" || mode === "hybrid") && validOptions && validOptions.length >= 2 && nftInsertData && nftInsertData[0]?.id) {
      const nft_id = nftInsertData[0].id;
      // Store options array in suggestion_text (as array)
      const suggestionRow = {
        user_id: user_id ?? undefined,
        nft_id,
        suggestion_text: validOptions, // <-- store options array in suggestion_text (text[])
        votes: Array(validOptions.length).fill(0),
        created_at: new Date().toISOString(),
      };
      const { error: suggestionError } = await supabase.from("suggestions").insert([suggestionRow]);
      if (suggestionError) {
        await supabase.from("nfts").delete().eq("id", nft_id);
        await supabase.storage.from("post-uploads/${filename}");
        return { success: false, error: `NFT saved, but failed to save suggestions: ${suggestionError.message}` };
      }
    }
    // Insert an empty suggestion row for open_suggestion mode
    if (mode === "open_suggestion" && nftInsertData && nftInsertData[0]?.id) {
      const nft_id = nftInsertData[0].id;
      const suggestionRow = {
        user_id: user_id ?? undefined,
        nft_id,
        suggestion_text: "", // empty string for open_suggestion
        votes: [0],
        created_at: new Date().toISOString(),
      };
      const { error: suggestionError } = await supabase.from("suggestions").insert([suggestionRow]);
      if (suggestionError) {
        await supabase.from("nfts").delete().eq("id", nft_id);
        await supabase.storage.from("post-uploads/${filename}");
        return { success: false, error: `NFT saved, but failed to save initial empty suggestion: ${suggestionError.message}` };
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
