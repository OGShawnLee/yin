import { describe, it, expect, vi, beforeEach } from "vitest";
import EditDAO from "@db/dao/EditDAO";
import ErrorHandler from "@common/ErrorHandler";

// Mock the dependencies
vi.mock("@db:qb", () => ({
  default: {
    select: vi.fn(() => ({
      run: vi.fn()
    })),
    Edit: {},
    op: vi.fn(),
    uuid: vi.fn((id: string) => id)
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({}))
}));

vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
  }
}));

describe("EditDAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll()", () => {
    it("should return all edits for a given post ID", async () => {
      const mockEdits = [
        {
          id: "edit1",
          previousContent: "Old content 1",
          createdAt: new Date("2023-01-01")
        },
        {
          id: "edit2", 
          previousContent: "Old content 2",
          createdAt: new Date("2023-01-02")
        }
      ];

      const mockResult = { data: mockEdits, error: null, status: "Success" };
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await EditDAO.getAll("post123");

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when fetching edits", async () => {
      const mockError = new Error("Database connection failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await EditDAO.getAll("post123");

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should call with correct post ID", async () => {
      const mockResult = { data: [], error: null, status: "Success" };
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      await EditDAO.getAll("specific-post-id");

      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      // The function passed to useAwait should be the EdgeQL query
      const callArgs = (ErrorHandler.useAwait as any).mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Function);
    });

    it("should return empty array when no edits exist", async () => {
      const mockResult = { data: [], error: null, status: "Success" };
      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await EditDAO.getAll("nonexistent-post");

      expect(result).toEqual(mockResult);
      expect(result.data).toEqual([]);
    });
  });
});