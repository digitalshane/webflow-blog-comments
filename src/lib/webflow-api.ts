const WEBFLOW_API_BASE = "https://api.webflow.com/v2";

function getEnv() {
  const siteId = process.env.WEBFLOW_SITE_ID;
  const token = process.env.WEBFLOW_SITE_API_TOKEN;
  if (!siteId || !token) {
    throw new Error("Missing WEBFLOW_SITE_ID or WEBFLOW_SITE_API_TOKEN");
  }
  return { siteId, token };
}

function headers() {
  const { token } = getEnv();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// Cached collection ID
let commentsCollectionId: string | null = null;

async function getCommentsCollectionId(): Promise<string> {
  if (commentsCollectionId) return commentsCollectionId;

  const { siteId } = getEnv();
  const res = await fetch(
    `${WEBFLOW_API_BASE}/sites/${siteId}/collections`,
    { headers: headers() }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { collections?: { id: string; displayName: string }[] };
  const collection = data.collections?.find(
    (c: { displayName: string }) =>
      c.displayName.toLowerCase() === "comments"
  );

  if (!collection) {
    throw new Error('No "Comments" collection found in Webflow CMS');
  }

  commentsCollectionId = collection.id as string;
  return commentsCollectionId;
}

export interface CommentItem {
  id: string;
  name: string;
  commentText: string;
  postSlug: string;
  timestamp: string;
  flagged: boolean;
}

interface WebflowItem {
  id: string;
  fieldData: {
    name?: string;
    "comment-text"?: string;
    "post-slug"?: string;
    timestamp?: string;
    flagged?: boolean;
  };
}

function mapItem(item: WebflowItem): CommentItem {
  return {
    id: item.id,
    name: item.fieldData.name ?? "",
    commentText: item.fieldData["comment-text"] ?? "",
    postSlug: item.fieldData["post-slug"] ?? "",
    timestamp: item.fieldData.timestamp ?? "",
    flagged: item.fieldData.flagged ?? false,
  };
}

export async function getComments(postSlug?: string): Promise<CommentItem[]> {
  const collectionId = await getCommentsCollectionId();
  const items: CommentItem[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `${WEBFLOW_API_BASE}/collections/${collectionId}/items?limit=${limit}&offset=${offset}`,
      { headers: headers() }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch comments: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as { items?: WebflowItem[] };
    const pageItems: WebflowItem[] = data.items ?? [];
    items.push(...pageItems.map(mapItem));

    if (pageItems.length < limit) break;
    offset += limit;
  }

  if (postSlug) {
    return items.filter((c) => c.postSlug === postSlug);
  }
  return items;
}

export async function createComment(input: {
  name: string;
  comment: string;
  postSlug: string;
  timestamp: string;
  flagged: boolean;
}): Promise<CommentItem> {
  const collectionId = await getCommentsCollectionId();

  const res = await fetch(
    `${WEBFLOW_API_BASE}/collections/${collectionId}/items/live`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        fieldData: {
          name: input.name,
          slug: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          "comment-text": input.comment,
          "post-slug": input.postSlug,
          timestamp: input.timestamp,
          flagged: input.flagged,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create comment: ${res.status} ${await res.text()}`);
  }

  const item = (await res.json()) as WebflowItem;
  return mapItem(item);
}
