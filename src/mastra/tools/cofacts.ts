/**
 * Fact-checking tools for Cofacts AI agents to verify suspicious messages and claims.
 *
 * Articles in Cofacts represent suspicious messages reported by users through LINE.
 * Each Article may have multiple ArticleReplies (fact-check responses from collaborators)
 * and ReplyRequests (additional context provided by reporters or collaborators).
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// GraphQL fragment for common Article fields
const COMMON_ARTICLE_FIELDS = `
  fragment CommonArticleFields on Article {
    id
    text
    createdAt
    articleType
    attachmentUrl(variant: PREVIEW)
    factCheckCount: replyCount
    communityDemandCount: replyRequestCount
    hyperlinks {
      url
      title
      summary
      status
      error
    }
    factCheckResponses: articleReplies(statuses: [NORMAL]) {
      reply {
        id
        type
        text
        createdAt
        reference
        user {
          name
        }
        hyperlinks {
          url
          normalizedUrl
          title
          summary
          topImageUrl
          status
          error
        }
      }
      user {
        name
      }
      createdAt
      helpfulCount: positiveFeedbackCount
      unhelpfulCount: negativeFeedbackCount
      feedbacks(statuses: [NORMAL]) {
        vote
        comment
        createdAt
        user {
          name
        }
      }
    }
    additionalContext: replyRequests(statuses: [NORMAL]) {
      user {
        name
      }
      reason
      createdAt
      helpfulCount: positiveFeedbackCount
      unhelpfulCount: negativeFeedbackCount
    }
    bundledMessages: cooccurrences {
      id
      articleIds
      createdAt
      articles {
        id
        text
        articleType
        attachmentUrl(variant: PREVIEW)
      }
    }
    relatedArticles(first: 10) {
      totalCount
      edges {
        node {
          id
          text
          articleType
          factCheckCount: replyCount
          createdAt
          factCheckResponses: articleReplies(statuses: [NORMAL]) {
            reply {
              id
              type
              text
            }
            helpfulCount: positiveFeedbackCount
            unhelpfulCount: negativeFeedbackCount
          }
        }
        score
      }
    }
    stats(dateRange: { GTE: "now-90d/d" }) {
      date
      lineUser
      lineVisit
      webUser
      webVisit
      downstreamBotUsers: liffUser
      downstreamBotVisits: liffVisit
    }
  }
`;

/**
 * Execute a GraphQL query against Cofacts API with standardized error handling.
 */
async function executeCofactsGraphql(
  query: string,
  variables: Record<string, unknown>,
  operationName = "GraphQL request"
): Promise<Record<string, unknown>> {
  try {
    const response = await fetch("https://api.cofacts.tw/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = (await response.json()) as {
      data?: Record<string, unknown>;
      errors?: unknown[];
    };

    if (result.errors) {
      return {
        error: `GraphQL errors: ${JSON.stringify(result.errors)}`,
        graphql_request: { query, variables },
      };
    }

    return {
      success: true,
      data: result.data,
      graphql_request: { query, variables },
    };
  } catch (e) {
    return {
      error: `Failed to execute ${operationName}: ${e instanceof Error ? e.message : String(e)}`,
      graphql_request: { query, variables },
    };
  }
}

/**
 * Resolve a vertexaisearch redirect URL to its final destination.
 */
export async function resolveVertexRedirect(url: string): Promise<string> {
  if (!url.includes("vertexaisearch.cloud.google.com/grounding-api-redirect/")) {
    return url;
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    return response.url;
  } catch (e) {
    console.error(`Failed to resolve redirect for ${url}:`, e);
    return url;
  }
}

// --- Mastra Tools ---

export const searchCofactsDatabase = createTool({
  id: "search-cofacts-database",
  description: `Search the Cofacts database for articles using various filters.

This unified function can:
- Search by text similarity (query parameter)
- Get specific articles by IDs (articleIds parameter)
- Find trending articles needing fact-checks (replyCountMax + daysBack)
- Apply various filters and sorting options

Cofacts Articles represent suspicious messages reported by LINE users. Key information includes:
- articleType: Whether the message is TEXT, IMAGE, VIDEO, or AUDIO
- text: For text messages, this is the content. For media, this is OCR/transcript result
- attachmentUrl: Preview of media content (when articleType is not TEXT)
- factCheckResponses: Fact-check responses from collaborators with community feedback scores
- additionalContext: Additional context from reporters with community ratings
- communityDemandCount: Number of people who wanted to know the truth
- hyperlinks: URLs found in the message with crawled metadata
- bundledMessages: Messages reported together, indicating they were shared as a set
- relatedArticles: Similar messages that may have existing fact-checks
- stats: Actual traffic/popularity data (views, visits) for current hotness metrics`,
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe(
        "The suspicious message or claim to search for (similarity search)"
      ),
    articleIds: z
      .array(z.string())
      .optional()
      .describe("List of specific article IDs to retrieve"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of results to return"),
    after: z
      .string()
      .optional()
      .describe("Cursor for pagination - returns results after this cursor"),
    replyCountMax: z
      .number()
      .int()
      .optional()
      .describe(
        "Maximum number of replies (useful for finding articles needing more fact-checks)"
      ),
    daysBack: z
      .number()
      .int()
      .optional()
      .describe(
        "Only include articles created within this many days (for trending articles)"
      ),
    orderBy: z
      .enum(["_score", "replyRequestCount", "createdAt"])
      .default("_score")
      .describe("Sort order"),
  }),
  execute: async (input) => {
    const filterObj: Record<string, unknown> = {};

    if (input.query) {
      filterObj.moreLikeThis = {
        like: input.query,
        minimumShouldMatch: "0",
      };
    }

    if (input.articleIds) {
      filterObj.ids = input.articleIds;
    }

    if (input.replyCountMax !== undefined) {
      filterObj.replyCount = { LT: input.replyCountMax };
    }

    if (input.daysBack !== undefined) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.daysBack);
      filterObj.createdAt = {
        GTE: startDate.toISOString(),
        LTE: endDate.toISOString(),
      };
    }

    let orderByObj: Record<string, string>[];
    if (input.orderBy === "replyRequestCount") {
      orderByObj = [{ replyRequestCount: "DESC" }, { createdAt: "DESC" }];
    } else if (input.orderBy === "createdAt") {
      orderByObj = [{ createdAt: "DESC" }];
    } else {
      orderByObj = [{ _score: "DESC" }];
    }

    const graphqlQuery = `
      ${COMMON_ARTICLE_FIELDS}

      query ListArticles($filter: ListArticleFilter!, $orderBy: [ListArticleOrderBy!]!, $first: Int!, $after: String) {
        ListArticles(
          filter: $filter
          orderBy: $orderBy
          first: $first
          after: $after
        ) {
          totalCount
          pageInfo {
            firstCursor
            lastCursor
          }
          edges {
            node {
              ...CommonArticleFields
            }
            score
            cursor
          }
        }
      }
    `;

    const variables = {
      filter: filterObj,
      orderBy: orderByObj,
      first: input.limit,
      after: input.after,
    };

    const result = await executeCofactsGraphql(
      graphqlQuery,
      variables,
      "search Cofacts database"
    );

    if ("error" in result) {
      return result;
    }

    const data = result.data as Record<string, unknown>;
    return {
      graphql_request: result.graphql_request,
      data: data.ListArticles,
    };
  },
});

export const getSingleCofactsArticle = createTool({
  id: "get-single-cofacts-article",
  description: `Get a single article from Cofacts database by ID.

Returns the same detailed article information as searchCofactsDatabase, but for a single specific article.
The article ID can be used to construct Cofacts URLs: https://cofacts.tw/article/{articleId}`,
  inputSchema: z.object({
    articleId: z
      .string()
      .describe("The Cofacts article ID to retrieve"),
  }),
  execute: async (input) => {
    const graphqlQuery = `
      ${COMMON_ARTICLE_FIELDS}

      query GetArticle($id: String!) {
        GetArticle(id: $id) {
          ...CommonArticleFields
        }
      }
    `;

    const variables = { id: input.articleId };

    const result = await executeCofactsGraphql(
      graphqlQuery,
      variables,
      "get specific Cofacts article"
    );

    if ("error" in result) {
      return result;
    }

    const data = result.data as Record<string, unknown>;
    const article = data.GetArticle;

    if (!article) {
      return {
        error: "Article not found",
        article_id: input.articleId,
        graphql_request: result.graphql_request,
      };
    }

    return {
      article_id: input.articleId,
      article,
      graphql_request: result.graphql_request,
    };
  },
});

export const submitCofactsReply = createTool({
  id: "submit-cofacts-reply",
  description: `Submit a fact-check reply to Cofacts (requires authentication).

Note: This requires authentication with Cofacts API which is not yet implemented.
Currently returns a placeholder response.`,
  inputSchema: z.object({
    articleId: z.string().describe("The Cofacts article ID to reply to"),
    replyType: z
      .enum(["RUMOR", "NOT_RUMOR", "OPINIONATED", "NOT_ARTICLE"])
      .describe("Type of reply"),
    text: z.string().describe("The fact-check response text"),
    reference: z.string().describe("URLs and summaries as references"),
  }),
  execute: async (input) => {
    // Placeholder - authentication not implemented yet
    return {
      message: "Reply submission requires authentication setup",
      article_id: input.articleId,
      reply_type: input.replyType,
      text_length: input.text.length,
      reference_length: input.reference.length,
    };
  },
});
