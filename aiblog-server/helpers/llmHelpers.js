export function getItemId(item) {
    return item.oid || item.id;
} 

export function createPrompt(items, notes) {
  let prompt = `
    You are an expert developer and senior technical writer.
    Your task is to write a developer blog post in KOREAN, formatted in Markdown.
    The post should summarize the following GitHub activities (commits and pull requests).
    Use the user's notes for context on what was important.
    
    Structure the post with a suitable title, a brief introduction, bullet points for key changes, and a concluding summary.
    Ensure the tone is professional but engaging.

    Here is the data:
    ---
  `;

  items.forEach((item, index) => {
    const id = getItemId(item);
    const userNote = notes[id] || 'No specific note provided.';
    const isCommit = item.__typename === 'Commit';

    const title = isCommit ? item.messageHeadline : item.title;
    const author =
      (isCommit ? item.author?.user?.login : item.author?.login) || 'unknown';
    const date = isCommit ? item.committedDate : item.createdAt;

    prompt += `
    Activity ${index + 1} (${item.__typename}):
    - Title: ${title}
    - Author: ${author}
    - Date: ${date}
    - User Note: ${userNote}
    ---
    `;
  });

  prompt += `
    Please write the final blog post based on this data.
    Start with a Markdown title (e.g., "## 주간 개발 요약").
  `;

  return prompt;
};

