// Blog Comments Embed - Standalone vanilla JS (no framework dependencies)
// Bundled via esbuild into an IIFE for use as a <script> tag on any page.

interface Comment {
  id: string;
  name: string;
  commentText: string;
  timestamp: string;
  _optimistic?: boolean;
  _failed?: boolean;
}

// ---------------------------------------------------------------------------
// State Engine
// ---------------------------------------------------------------------------

type Subscriber = () => void;

class CommentState {
  private comments: Comment[] = [];
  private subscribers: Subscriber[] = [];
  loading = true;

  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
  }

  private notify() {
    for (const fn of this.subscribers) fn();
  }

  getComments(): Comment[] {
    return this.comments;
  }

  setComments(serverComments: Comment[]) {
    // Preserve optimistic entries that haven't been confirmed yet
    const optimistic = this.comments.filter((c) => c._optimistic);
    this.comments = [...serverComments, ...optimistic];
    this.loading = false;
    this.notify();
  }

  addOptimistic(comment: Comment) {
    this.comments = [comment, ...this.comments];
    this.notify();
  }

  confirmComment(optimisticId: string, serverComment: Comment) {
    this.comments = this.comments.map((c) =>
      c.id === optimisticId ? serverComment : c
    );
    this.notify();
  }

  removeComment(id: string) {
    this.comments = this.comments.filter((c) => c.id !== id);
    this.notify();
  }

  failComment(id: string) {
    this.comments = this.comments.map((c) =>
      c.id === id ? { ...c, _failed: true, _optimistic: false } : c
    );
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

const COOKIE_NAME = "blog_commenter_name";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getCookie(name: string): string {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// API base URL discovery
// ---------------------------------------------------------------------------

function discoverApiBase(): string {
  // Derive the base from the script's own URL.
  // e.g. https://domain/comments/comments-embed.min.js -> https://domain/comments
  const scripts = document.querySelectorAll("script[src]");
  for (let i = 0; i < scripts.length; i++) {
    const src = (scripts[i] as HTMLScriptElement).src;
    if (src.includes("comments-embed")) {
      try {
        const url = new URL(src);
        const pathDir = url.pathname.substring(0, url.pathname.lastIndexOf("/"));
        return url.origin + pathDir;
      } catch {
        // ignore parse errors
      }
    }
  }
  // Fallback: same origin
  return window.location.origin;
}

// ---------------------------------------------------------------------------
// HTML escaping (XSS prevention)
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Slug detection
// ---------------------------------------------------------------------------

function getPageSlug(): string {
  // Take the last non-empty path segment as the slug
  const parts = window.location.pathname.replace(/\/+$/, "").split("/");
  return parts[parts.length - 1] || "home";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(function () {
  const state = new CommentState();
  const apiBase = discoverApiBase();
  const pageSlug = getPageSlug();

  function init() {
    const container = document.querySelector(".comments");
    if (!container) return;

    injectStyles();
    renderShell(container as HTMLElement);
    state.subscribe(() => renderComments(container as HTMLElement));
    fetchComments();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .comments-list { margin-top: 24px; }
      .comment-item {
        padding: 16px;
        border: 1px solid #e2e2e2;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      .comment-item.optimistic { opacity: 0.6; }
      .comment-item.failed { border-color: #e74c3c; }
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .comment-author {
        font-weight: 600;
        font-size: 14px;
      }
      .comment-time {
        font-size: 12px;
        color: #888;
      }
      .comment-body {
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .comment-status {
        font-size: 12px;
        color: #888;
        margin-top: 4px;
      }
      .comment-dismiss {
        background: none;
        border: none;
        color: #e74c3c;
        cursor: pointer;
        font-size: 12px;
        padding: 0;
        margin-left: 8px;
      }
      .comments-empty {
        text-align: center;
        color: #888;
        padding: 24px 0;
        font-size: 14px;
      }
      .comments-loading {
        text-align: center;
        color: #888;
        padding: 24px 0;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  function renderShell(container: HTMLElement) {
    const savedName = getCookie(COOKIE_NAME);

    container.innerHTML = `
      <form id="comments-form" novalidate>
        <input
          type="text"
          class="w-input"
          id="comments-name"
          placeholder="Your name"
          maxlength="100"
          value="${escapeHtml(savedName)}"
        />
        <textarea
          class="w-input"
          id="comments-textarea"
          placeholder="Write a comment..."
          maxlength="2000"
          rows="3"
          style="resize: vertical; margin-top: 8px;"
        ></textarea>
        <button type="submit" class="w-button" style="margin-top: 8px;">
          Post Comment
        </button>
      </form>
      <div class="comments-list">
        <div class="comments-loading">Loading comments...</div>
      </div>
    `;

    const form = container.querySelector("#comments-form") as HTMLFormElement;
    form.addEventListener("submit", handleSubmit);
  }

  function renderComments(container: HTMLElement) {
    const listEl = container.querySelector(".comments-list");
    if (!listEl) return;

    const comments = state.getComments();

    if (state.loading) {
      listEl.innerHTML = '<div class="comments-loading">Loading comments...</div>';
      return;
    }

    if (comments.length === 0) {
      listEl.innerHTML =
        '<div class="comments-empty">No comments yet. Be the first!</div>';
      return;
    }

    // Sort newest first
    const sorted = [...comments].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    listEl.innerHTML = sorted
      .map((c) => {
        const classes = [
          "comment-item",
          c._optimistic ? "optimistic" : "",
          c._failed ? "failed" : "",
        ]
          .filter(Boolean)
          .join(" ");

        let status = "";
        if (c._optimistic) {
          status = '<div class="comment-status">Posting...</div>';
        } else if (c._failed) {
          status = `<div class="comment-status">Failed to post <button class="comment-dismiss" data-dismiss-id="${escapeHtml(c.id)}">Dismiss</button></div>`;
        }

        return `
          <div class="${classes}">
            <div class="comment-header">
              <span class="comment-author">${escapeHtml(c.name)}</span>
              <span class="comment-time">${formatTime(c.timestamp)}</span>
            </div>
            <div class="comment-body">${escapeHtml(c.commentText)}</div>
            ${status}
          </div>
        `;
      })
      .join("");

    // Bind dismiss buttons
    listEl.querySelectorAll(".comment-dismiss").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = (e.target as HTMLElement).getAttribute("data-dismiss-id");
        if (id) state.removeComment(id);
      });
    });
  }

  async function fetchComments() {
    try {
      const res = await fetch(`${apiBase}/api/comments?slug=${encodeURIComponent(pageSlug)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.setComments(data.comments ?? []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      state.setComments([]);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const nameInput = document.getElementById("comments-name") as HTMLInputElement;
    const textarea = document.getElementById("comments-textarea") as HTMLTextAreaElement;
    const name = nameInput.value.trim();
    const comment = textarea.value.trim();

    if (!name || !comment) return;

    // Save name cookie
    setCookie(COOKIE_NAME, name);

    // Optimistic ID
    const optimisticId = "_opt_" + Date.now() + Math.random();
    const optimisticComment: Comment = {
      id: optimisticId,
      name,
      commentText: comment,
      timestamp: new Date().toISOString(),
      _optimistic: true,
    };

    state.addOptimistic(optimisticComment);
    textarea.value = "";

    try {
      const res = await fetch(`${apiBase}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, slug: pageSlug }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.flagged) {
        // Silently remove flagged comments from the UI
        state.removeComment(optimisticId);
      } else {
        state.confirmComment(optimisticId, data.comment);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      state.failComment(optimisticId);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
