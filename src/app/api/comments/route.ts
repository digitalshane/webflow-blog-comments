import { NextRequest, NextResponse } from "next/server";
import { getComments, createComment } from "@/lib/webflow-api";
import { moderateComment } from "@/lib/moderation";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug") ?? undefined;
    const allComments = await getComments(slug);
    const visible = allComments.filter((c) => !c.flagged);
    return NextResponse.json({ comments: visible }, { headers: corsHeaders });
  } catch (err) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, comment, slug } = body;

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or fewer" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (comment.trim().length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 2000 characters or fewer" },
        { status: 400, headers: corsHeaders }
      );
    }

    const moderation = moderateComment(name.trim(), comment.trim());
    const timestamp = new Date().toISOString();

    const created = await createComment({
      name: name.trim(),
      comment: comment.trim(),
      postSlug: slug.trim(),
      timestamp,
      flagged: moderation.flagged,
    });

    return NextResponse.json(
      {
        comment: created,
        flagged: moderation.flagged,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500, headers: corsHeaders }
    );
  }
}
