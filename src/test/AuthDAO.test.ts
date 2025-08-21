import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthDAO from "@db/dao/AuthDAO";
import AuthSchema from "@business/schema/AuthSchema";
import NotFoundError from "@db/NotFoundError";
import { UserDAO } from "@db/dao/UserDAO";
import type { CurrentUserShape } from "@business/schema/AuthSchema";

// Mock the dependencies
vi.mock("@business/schema/AuthSchema", () => ({
  default: {
    getValidCurrentUser: vi.fn()
  }
}));

vi.mock("@db/dao/UserDAO", () => ({
  UserDAO: {
    getOneReference: vi.fn()
  }
}));

vi.mock("@db:qb", () => ({
  default: {
    select: vi.fn(() => ({
      run: vi.fn()
    }))
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({}))
}));

describe("AuthDAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findCurrentUser()", () => {
    const mockPayload: CurrentUserShape = {
      id: "user123",
      name: "Test User",
      displayName: "testuser",
      isPro: false
    };

    it("should return current user when user exists", async () => {
      const mockDbUser = {
        id: "user123",
        name: "Test User",
        displayName: "testuser",
        isPro: false
      };

      const mockValidUser = {
        id: "user123",
        name: "Test User", 
        displayName: "testuser",
        isPro: false
      };

      const mockUserReference = {
        id: "user123",
        name: "Test User",
        displayName: "testuser",
        isPro: false
      };

      // Mock UserDAO.getOneReference
      (UserDAO.getOneReference as any).mockReturnValue(mockUserReference);

      // Mock the select query to return a user
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbUser)
      };
      
      const e = await import("@db:qb");
      (e.default.select as any).mockReturnValue(mockSelect);

      // Mock AuthSchema.getValidCurrentUser
      (AuthSchema.getValidCurrentUser as any).mockReturnValue(mockValidUser);

      const result = await AuthDAO.findCurrentUser(mockPayload);

      expect(UserDAO.getOneReference).toHaveBeenCalledWith("testuser");
      expect(e.default.select).toHaveBeenCalledWith({
        id: mockUserReference.id,
        name: mockUserReference.name,
        displayName: mockUserReference.displayName,
        isPro: mockUserReference.isPro
      });
      expect(AuthSchema.getValidCurrentUser).toHaveBeenCalledWith(mockDbUser);
      expect(result).toEqual(mockValidUser);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      const mockDbUser = { id: null };

      // Mock UserDAO.getOneReference
      (UserDAO.getOneReference as any).mockReturnValue({});

      // Mock the select query to return null/empty user
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbUser)
      };
      
      const e = await import("@db:qb");
      (e.default.select as any).mockReturnValue(mockSelect);

      await expect(AuthDAO.findCurrentUser(mockPayload)).rejects.toThrow(NotFoundError);
      await expect(AuthDAO.findCurrentUser(mockPayload)).rejects.toThrow("Current User doesn't exist.");

      expect(UserDAO.getOneReference).toHaveBeenCalledWith("testuser");
      expect(AuthSchema.getValidCurrentUser).not.toHaveBeenCalled();
    });

    it("should handle empty id in database response", async () => {
      const mockDbUser = {
        id: "",
        name: "Test User",
        displayName: "testuser",
        isPro: false
      };

      // Mock UserDAO.getOneReference
      (UserDAO.getOneReference as any).mockReturnValue({});

      // Mock the select query to return user with empty id
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbUser)
      };
      
      const e = await import("@db:qb");
      (e.default.select as any).mockReturnValue(mockSelect);

      await expect(AuthDAO.findCurrentUser(mockPayload)).rejects.toThrow(NotFoundError);
      expect(AuthSchema.getValidCurrentUser).not.toHaveBeenCalled();
    });

    it("should handle undefined id in database response", async () => {
      const mockDbUser = {
        id: undefined,
        name: "Test User",
        displayName: "testuser",
        isPro: false
      };

      // Mock UserDAO.getOneReference
      (UserDAO.getOneReference as any).mockReturnValue({});

      // Mock the select query
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbUser)
      };
      
      const e = await import("@db:qb");
      (e.default.select as any).mockReturnValue(mockSelect);

      await expect(AuthDAO.findCurrentUser(mockPayload)).rejects.toThrow(NotFoundError);
      expect(AuthSchema.getValidCurrentUser).not.toHaveBeenCalled();
    });
  });
});