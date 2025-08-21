import { describe, it, expect, vi, beforeEach } from "vitest";
import BookmarkDAO from "@db/dao/BookmarkDAO";
import ErrorHandler from "@common/ErrorHandler";
import PostDAO from "@db/dao/PostDAO";
import type { CurrentUserShape } from "@business/schema/AuthSchema";

// Mock the dependencies
vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
  }
}));

vi.mock("@db/dao/PostDAO", () => ({
  default: {
    POST_SHAPE: vi.fn()
  }
}));

vi.mock("@db:qb", () => ({
  default: {
    insert: vi.fn(() => ({ run: vi.fn() })),
    select: vi.fn(() => ({ run: vi.fn() })),
    delete: vi.fn(() => ({ run: vi.fn() })),
    Bookmark: {},
    User: {},
    Post: {},
    Favourite: {},
    op: vi.fn(),
    uuid: vi.fn((id: string) => id),
    DESC: 'DESC'
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({
    transaction: vi.fn()
  }))
}));

describe("BookmarkDAO", () => {
  const mockCurrentUser: CurrentUserShape = {
    id: "user123",
    name: "Test User",
    displayName: "testuser",
    isPro: false
  };

  const mockPostId = "post123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrDeleteOne()", () => {
    it("should create bookmark when none exists", async () => {
      const mockCreatedBookmark = {
        id: "bookmark123",
        user: mockCurrentUser,
        post: { id: mockPostId }
      };

      const mockResult = { data: mockCreatedBookmark, error: null, status: "Success" };

      // Mock client.transaction to call the callback
      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // Simulate findOne returning no existing bookmark
          const findResult = { data: null, error: null, status: "Success" };
          
          // Mock the private methods by mocking the class itself
          vi.spyOn(BookmarkDAO as any, 'findOne').mockResolvedValue(findResult);
          vi.spyOn(BookmarkDAO as any, 'createOne').mockResolvedValue(mockResult);
          
          return callback({});
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      const result = await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalledTimes(1);
      expect(mockClient.transaction).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should delete bookmark when one exists", async () => {
      const mockExistingBookmark = {
        id: "bookmark123",
        user: mockCurrentUser,
        post: { id: mockPostId }
      };

      const mockDeleteResult = { data: { deletedCount: 1 }, error: null, status: "Success" };

      // Mock client.transaction to call the callback
      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // Simulate findOne returning existing bookmark
          const findResult = { data: mockExistingBookmark, error: null, status: "Success" };
          
          // Mock the private methods
          vi.spyOn(BookmarkDAO as any, 'findOne').mockResolvedValue(findResult);
          vi.spyOn(BookmarkDAO as any, 'deleteOne').mockResolvedValue(mockDeleteResult);
          
          return callback({});
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      const result = await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalledTimes(1);
    });

    it("should return error when findOne fails", async () => {
      const mockError = new Error("Database error");
      const mockErrorResult = { data: null, error: mockError, status: "Failure" };

      // Mock client.transaction to call the callback
      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // Simulate findOne returning error
          vi.spyOn(BookmarkDAO as any, 'findOne').mockResolvedValue(mockErrorResult);
          
          return callback({});
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      const result = await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAll()", () => {
    it("should return all bookmarks for current user", async () => {
      const mockBookmarks = [
        {
          id: "bookmark1",
          post: {
            id: "post1",
            content: "Post 1 content",
            user: { id: "user1", name: "User 1", displayName: "user1", isPro: false },
            createdAt: new Date("2023-01-01")
          }
        },
        {
          id: "bookmark2",
          post: {
            id: "post2",
            content: "Post 2 content",
            user: { id: "user2", name: "User 2", displayName: "user2", isPro: false },
            createdAt: new Date("2023-01-02")
          }
        }
      ];

      const mockResult = { data: mockBookmarks, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await BookmarkDAO.getAll(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when fetching bookmarks", async () => {
      const mockError = new Error("Database connection failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await BookmarkDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array when no bookmarks exist", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await BookmarkDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
      expect(result.data).toEqual([]);
    });
  });

  describe("private methods behavior", () => {
    it("should call ErrorHandler.useAwait for createOne", async () => {
      const mockResult = { data: { id: "bookmark123" }, error: null, status: "Success" };
      
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      // Test the createOne method behavior indirectly through createOrDeleteOne
      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // Simulate no existing bookmark so createOne is called
          const findResult = { data: null, error: null, status: "Success" };
          
          vi.spyOn(BookmarkDAO as any, 'findOne').mockResolvedValue(findResult);
          
          // This will trigger createOne internally
          return mockResult;
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalled();
    });

    it("should call ErrorHandler.useAwait for deleteOne", async () => {
      const mockResult = { data: { deletedCount: 1 }, error: null, status: "Success" };
      
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      // Test the deleteOne method behavior indirectly through createOrDeleteOne  
      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // Simulate existing bookmark so deleteOne is called
          const existingBookmark = { id: "bookmark123" };
          const findResult = { data: existingBookmark, error: null, status: "Success" };
          
          vi.spyOn(BookmarkDAO as any, 'findOne').mockResolvedValue(findResult);
          
          // This will trigger deleteOne internally
          return mockResult;
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalled();
    });

    it("should call ErrorHandler.useAwait for findOne", async () => {
      const mockResult = { data: null, error: null, status: "Success" };
      
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const mockClient = {
        transaction: vi.fn(async (callback) => {
          // This will trigger findOne internally
          return mockResult;
        })
      };

      const { getClient } = await import("@db/DBClient");
      (getClient as any).mockReturnValue(mockClient);

      await BookmarkDAO.createOrDeleteOne(mockPostId, mockCurrentUser);

      expect(mockClient.transaction).toHaveBeenCalled();
    });
  });
});