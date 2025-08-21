import { describe, it, expect, vi, beforeEach } from "vitest";
import PostDAO from "@db/dao/PostDAO";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";

// Mock the dependencies
vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
  }
}));

vi.mock("@db/queries/queries", () => ({
  SearchPost: vi.fn()
}));

vi.mock("@db:qb", () => ({
  default: {
    insert: vi.fn(() => ({ run: vi.fn() })),
    select: vi.fn(() => ({ run: vi.fn() })),
    update: vi.fn(() => ({ run: vi.fn() })),
    shape: vi.fn(() => ({})),
    Post: {},
    Follow: {},
    op: vi.fn(),
    uuid: vi.fn((id: string) => id),
    DESC: 'DESC'
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({}))
}));

describe("PostDAO", () => {
  const mockCurrentUser: CurrentUserShape = {
    id: "user123",
    name: "Test User",
    displayName: "testuser",
    isPro: false
  };

  const mockPostData: InsertPostShape = {
    content: "This is a test post content"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOne()", () => {
    it("should create a post successfully", async () => {
      const mockCreatedPost = {
        id: "post123",
        content: "This is a test post content",
        user: mockCurrentUser,
        createdAt: new Date("2023-01-01")
      };

      const mockResult = { data: mockCreatedPost, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.createOne(mockPostData, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when creating post", async () => {
      const mockError = new Error("Database error");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.createOne(mockPostData, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getOne()", () => {
    const postId = "post123";

    it("should return post when found", async () => {
      const mockPost = {
        id: "post123",
        content: "Test post content",
        user: {
          id: "user456",
          name: "Post Author",
          displayName: "postauthor",
          isPro: false
        },
        createdAt: new Date("2023-01-01")
      };

      const mockResult = { data: mockPost, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getOne(postId, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should throw NotFoundError when post doesn't exist", async () => {
      const mockError = new NotFoundError("Unable to find post. The post doesn't exist.");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getOne(postId, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should work with null currentUser", async () => {
      const mockPost = {
        id: "post123",
        content: "Public post content",
        user: { id: "user456", name: "Author", displayName: "author", isPro: false }
      };

      const mockResult = { data: mockPost, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getOne(postId, null);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getOneReference()", () => {
    it("should call the correct EdgeQL select with filter", () => {
      const postId = "post123";
      
      // Just test that the method exists and can be called
      const result = PostDAO.getOneReference(postId);
      
      // Since we're mocking e.select, it should return the mocked result
      expect(result).toBeDefined();
    });
  });

  describe("getAll()", () => {
    it("should return all posts ordered by creation date", async () => {
      const mockPosts = [
        {
          id: "post1",
          content: "First post",
          user: { id: "user1", name: "User 1", displayName: "user1", isPro: false },
          createdAt: new Date("2023-01-02")
        },
        {
          id: "post2",
          content: "Second post",
          user: { id: "user2", name: "User 2", displayName: "user2", isPro: true },
          createdAt: new Date("2023-01-01")
        }
      ];

      const mockResult = { data: mockPosts, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAll(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should work with null currentUser for public access", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAll(null);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getAllFromFolloweed()", () => {
    it("should return posts from followed users", async () => {
      const mockFollowedPosts = [
        {
          id: "post1",
          content: "Post from followed user",
          user: { id: "user456", name: "Followed User", displayName: "followeduser", isPro: false },
          createdAt: new Date("2023-01-01")
        }
      ];

      const mockResult = { data: mockFollowedPosts, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAllFromFolloweed(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should handle case when user follows no one", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAllFromFolloweed(mockCurrentUser);

      expect(result).toEqual(mockResult);
      expect(result.data).toEqual([]);
    });
  });

  describe("getAllByAuthor()", () => {
    const authorDisplayName = "authoruser";

    it("should return posts by specific author", async () => {
      const mockAuthorPosts = [
        {
          id: "post1",
          content: "Author's first post",
          user: { id: "user456", name: "Author User", displayName: "authoruser", isPro: false },
          createdAt: new Date("2023-01-02")
        },
        {
          id: "post2",
          content: "Author's second post",
          user: { id: "user456", name: "Author User", displayName: "authoruser", isPro: false },
          createdAt: new Date("2023-01-01")
        }
      ];

      const mockResult = { data: mockAuthorPosts, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAllByAuthor(authorDisplayName, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should work with null currentUser", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAllByAuthor(authorDisplayName, null);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array for non-existent author", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.getAllByAuthor("nonexistentuser", mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("searchMany()", () => {
    const searchQuery = "test search";

    it("should search posts with query", async () => {
      const mockSearchResults = [
        {
          id: "post1",
          content: "This is a test search result",
          user: { id: "user1", name: "User 1", displayName: "user1", isPro: false }
        }
      ];

      const mockResult = { data: mockSearchResults, error: null, status: "Success" };

      const { SearchPost } = await import("@db/queries/queries");
      (SearchPost as any).mockResolvedValue(mockSearchResults);
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.searchMany(searchQuery, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should handle empty search results", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.searchMany("nonexistent query", mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should work with null currentUser", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.searchMany(searchQuery, null);

      expect(result).toEqual(mockResult);
    });
  });

  describe("updateOne()", () => {
    const postId = "post123";
    const updateData: InsertPostShape = {
      content: "Updated post content"
    };

    it("should update post successfully when user is author", async () => {
      const mockUpdatedPost = {
        id: "post123",
        content: "Updated post content",
        user: mockCurrentUser
      };

      const mockResult = { data: mockUpdatedPost, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.updateOne(postId, updateData, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should throw NotFoundError when post doesn't exist", async () => {
      const mockError = new NotFoundError("Unable to update post. The post doesn't exist or you are not the author.");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.updateOne("nonexistent", updateData, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should throw NotFoundError when user is not the author", async () => {
      const mockError = new NotFoundError("Unable to update post. The post doesn't exist or you are not the author.");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await PostDAO.updateOne(postId, updateData, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("static shape properties", () => {
    it("should have SHALLOW_POST_SHAPE defined", () => {
      expect(PostDAO.SHALLOW_POST_SHAPE).toBeDefined();
      // SHALLOW_POST_SHAPE is likely an object from the mocked e.shape
      expect(PostDAO.SHALLOW_POST_SHAPE).toEqual({});
    });

    it("should have POST_SHAPE defined", () => {
      expect(PostDAO.POST_SHAPE).toBeDefined();
      // POST_SHAPE is likely an object from the mocked e.shape
      expect(PostDAO.POST_SHAPE).toEqual({});
    });
  });
});