import "dotenv/config";
import fs from "fs";
import path from "path";
import { supabase } from "../supabaseClient";
import { openai } from "../openaiClient";

async function main() {
  const docsDir = path.join(__dirname, "../docs");
  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    const content = fs.readFileSync(path.join(docsDir, file), "utf-8");

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const embedding = embeddingRes.data[0].embedding;

    const { error } = await supabase.from("documents").insert({
      content,
      metadata: { filename: file },
      embedding,
    });

    if (error) {
      console.error("Insert error", file, error);
    } else {
      console.log("Inserted", file);
    }
  }
}

main().catch(console.error);
