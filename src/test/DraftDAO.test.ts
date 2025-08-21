import { describe, it, expect, vi, beforeEach } from "vitest";
import DraftDAO from "@db/dao/DraftDAO";
import ErrorHandler from "@common/ErrorHandler";
import PostDAO from "@db/dao/PostDAO";
import NotFoundError from "@db/NotFoundError";
import { UserDAO } from "@db/dao/UserDAO";
import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";

// Mock the dependencies
vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
  }
}));

vi.mock("@db/dao/PostDAO", () => ({
  default: {
    SHALLOW_POST_SHAPE: vi.fn(),
    getOneReference: vi.fn()
  }
}));

vi.mock("@db/dao/UserDAO", () => ({
  UserDAO: {
    getOneReference: vi.fn()
  }
}));

vi.mock("@db:qb", () => ({
  default: {
    insert: vi.fn(() => ({ run: vi.fn() })),
    select: vi.fn(() => ({ run: vi.fn() })),
    update: vi.fn(() => ({ run: vi.fn() })),
    delete: vi.fn(() => ({ run: vi.fn() })),
    Draft: {},
    Post: {},
    op: vi.fn(),
    uuid: vi.fn((id: string) => id),
    DESC: 'DESC'
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({}))
}));

describe("DraftDAO", () => {
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
    it("should call ErrorHandler.useAwait for creating draft with quote", async () => {
      const quoteOfId = "quote123";
      const mockResult = { data: { id: "draft123" }, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.createOne(mockPostData, quoteOfId, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should call ErrorHandler.useAwait for creating draft without quote", async () => {
      const mockResult = { data: { id: "draft123" }, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.createOne(mockPostData, undefined, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when creating draft", async () => {
      const mockError = new Error("Database error");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.createOne(mockPostData, undefined, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getAll()", () => {
    it("should return all drafts for current user", async () => {
      const mockDrafts = [
        {
          id: "draft1",
          user: { id: "user123", name: "Test User", displayName: "testuser", isPro: false },
          content: "Draft 1 content",
          quoteOf: null,
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2023-01-01")
        },
        {
          id: "draft2",
          user: { id: "user123", name: "Test User", displayName: "testuser", isPro: false },
          content: "Draft 2 content",
          quoteOf: null,
          createdAt: new Date("2023-01-02"),
          updatedAt: new Date("2023-01-02")
        }
      ];

      const mockResult = { data: mockDrafts, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.getAll(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when fetching drafts", async () => {
      const mockError = new Error("Database connection failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getOne()", () => {
    const draftId = "draft123";

    it("should return draft when found", async () => {
      const mockDraft = {
        id: "draft123",
        content: "Test draft content",
        quoteOf: null
      };

      const mockResult = { data: mockDraft, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.getOne(draftId, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should throw NotFoundError when draft doesn't exist", async () => {
      const mockError = new NotFoundError("Unable to find Draft. It doesn't exist.");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.getOne(draftId, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should handle database errors", async () => {
      const mockError = new Error("Database connection failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.getOne(draftId, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("updateOne()", () => {
    const draftId = "draft123";
    const updateData: InsertPostShape = {
      content: "Updated draft content"
    };

    it("should update draft successfully", async () => {
      const mockUpdatedDraft = {
        id: "draft123",
        content: "Updated draft content"
      };

      const mockResult = { data: mockUpdatedDraft, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.updateOne(draftId, updateData, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when updating draft", async () => {
      const mockError = new Error("Update failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.updateOne(draftId, updateData, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("publishOne()", () => {
    const draftId = "draft123";
    const publishData: InsertPostShape = {
      content: "Content to publish"
    };

    it("should publish draft as post successfully", async () => {
      const mockPublishedPost = {
        id: "post123",
        content: "Content to publish",
        user: mockCurrentUser
      };

      const mockResult = { data: mockPublishedPost, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.publishOne(draftId, publishData, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when publishing draft", async () => {
      const mockError = new Error("Publish failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.publishOne(draftId, publishData, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });

  describe("deleteOne()", () => {
    const draftId = "draft123";

    it("should delete draft successfully", async () => {
      const mockResult = { data: { deletedCount: 1 }, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.deleteOne(draftId, mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when deleting draft", async () => {
      const mockError = new Error("Delete failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.deleteOne(draftId, mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should handle draft not found during deletion", async () => {
      const mockResult = { data: { deletedCount: 0 }, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await DraftDAO.deleteOne("nonexistent-draft", mockCurrentUser);

      expect(result).toEqual(mockResult);
    });
  });
});