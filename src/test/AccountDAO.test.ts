import { describe, it, expect, vi, beforeEach } from "vitest";
import AccountDAO from "@db/dao/AccountDAO";
import AccountDTO from "@business/dto/AccountDTO";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import { UserDAO } from "@db/dao/UserDAO";

// Mock the dependencies
vi.mock("@business/dto/AccountDTO");

vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
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

describe("AccountDAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findOneByUserDisplayName()", () => {
    it("should use ErrorHandler.useAwait with correct displayName", async () => {
      const mockDisplayName = "testuser";
      const mockResult = { data: null, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await AccountDAO.findOneByUserDisplayName(mockDisplayName);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle success case", async () => {
      const mockDisplayName = "testuser";
      const mockAccountData = {
        id: "account123",
        name: "Test User",
        displayName: "testuser",
        isPro: false,
        email: "test@example.com",
        password: "hashedpassword",
        refreshTokenVersion: 1,
        createdAt: new Date("2023-01-01")
      };
      const mockAccountDTO = new AccountDTO(mockAccountData as any);
      const mockResult = { data: mockAccountDTO, error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await AccountDAO.findOneByUserDisplayName(mockDisplayName);

      expect(result).toEqual(mockResult);
    });

    it("should handle error case", async () => {
      const mockDisplayName = "testuser";
      const mockError = new Error("Database error");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await AccountDAO.findOneByUserDisplayName(mockDisplayName);

      expect(result).toEqual(mockResult);
    });
  });

  describe("getOneByUserDisplayName()", () => {
    it("should call UserDAO.getOneReference with correct displayName", async () => {
      const mockDisplayName = "testuser";
      const mockUserRef = {
        account: {
          id: "account123",
          email: "test@example.com",
          password: "hashedpassword",
          refreshTokenVersion: 1
        },
        name: "Test User",
        displayName: "testuser",
        isPro: false,
        createdAt: new Date("2023-01-01")
      };

      const mockDbResult = {
        id: "account123",
        name: "Test User",
        displayName: "testuser",
        isPro: false,
        email: "test@example.com",
        password: "hashedpassword",
        refreshTokenVersion: 1,
        createdAt: new Date("2023-01-01")
      };

      const mockAccountDTO = new AccountDTO(mockDbResult as any);

      (UserDAO.getOneReference as any).mockReturnValue(mockUserRef);

      const e = await import("@db:qb");
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbResult)
      };
      (e.default.select as any).mockReturnValue(mockSelect);

      (AccountDTO as any).mockImplementation(() => mockAccountDTO);

      const result = await AccountDAO.getOneByUserDisplayName(mockDisplayName);

      expect(UserDAO.getOneReference).toHaveBeenCalledWith(mockDisplayName);
      expect(AccountDTO).toHaveBeenCalledWith(mockDbResult);
      expect(result).toEqual(mockAccountDTO);
    });

    it("should throw NotFoundError when candidate.id is falsy", async () => {
      const mockDisplayName = "testuser";
      const mockUserRef = {
        account: { id: null, email: null, password: null, refreshTokenVersion: null },
        name: null,
        displayName: null,
        isPro: null,
        createdAt: null
      };

      const mockDbResult = {
        id: null,
        name: null,
        displayName: null,
        isPro: null,
        email: null,
        password: null,
        refreshTokenVersion: null,
        createdAt: null
      };

      (UserDAO.getOneReference as any).mockReturnValue(mockUserRef);

      const e = await import("@db:qb");
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbResult)
      };
      (e.default.select as any).mockReturnValue(mockSelect);

      await expect(AccountDAO.getOneByUserDisplayName(mockDisplayName)).rejects.toThrow(NotFoundError);
      await expect(AccountDAO.getOneByUserDisplayName(mockDisplayName)).rejects.toThrow("Unable to find Account with the provided email.");

      expect(UserDAO.getOneReference).toHaveBeenCalledWith(mockDisplayName);
      expect(AccountDTO).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when candidate.id is empty string", async () => {
      const mockDisplayName = "testuser";
      const mockUserRef = {
        account: { id: "", email: "test@example.com", password: "hashedpassword", refreshTokenVersion: 1 },
        name: "Test User",
        displayName: "testuser",
        isPro: false,
        createdAt: new Date("2023-01-01")
      };

      const mockDbResult = {
        id: "",
        name: "Test User",
        displayName: "testuser",
        isPro: false,
        email: "test@example.com",
        password: "hashedpassword",
        refreshTokenVersion: 1,
        createdAt: new Date("2023-01-01")
      };

      (UserDAO.getOneReference as any).mockReturnValue(mockUserRef);

      const e = await import("@db:qb");
      const mockSelect = {
        run: vi.fn().mockResolvedValue(mockDbResult)
      };
      (e.default.select as any).mockReturnValue(mockSelect);

      await expect(AccountDAO.getOneByUserDisplayName(mockDisplayName)).rejects.toThrow(NotFoundError);

      expect(UserDAO.getOneReference).toHaveBeenCalledWith(mockDisplayName);
      expect(AccountDTO).not.toHaveBeenCalled();
    });
  });
});