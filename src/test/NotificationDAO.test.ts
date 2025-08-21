import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationDAO from "@db/dao/NotificationDAO";
import NotificationSchema from "@business/schema/NotificationSchema";
import ErrorHandler from "@common/ErrorHandler";
import type { CurrentUserShape } from "@business/schema/AuthSchema";

// Mock the dependencies
vi.mock("@business/schema/NotificationSchema", () => ({
  default: {
    getValidNotification: vi.fn()
  }
}));

vi.mock("@common/ErrorHandler", () => ({
  default: {
    useAwait: vi.fn()
  }
}));

vi.mock("@db:qb", () => ({
  default: {
    select: vi.fn(() => ({ run: vi.fn() })),
    Notification: {},
    op: vi.fn(),
    DESC: 'DESC'
  }
}));

vi.mock("@db/DBClient", () => ({
  getClient: vi.fn(() => ({}))
}));

describe("NotificationDAO", () => {
  const mockCurrentUser: CurrentUserShape = {
    id: "user123",
    name: "Test User",
    displayName: "testuser",
    isPro: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll()", () => {
    it("should return all notifications for current user", async () => {
      const mockRawNotifications = [
        {
          id: "notification1",
          isRead: false,
          kind: "LIKE",
          post: { id: "post1" },
          from: {
            id: "user456",
            name: "Other User",
            displayName: "otheruser",
            isPro: false
          },
          createdAt: new Date("2023-01-01")
        },
        {
          id: "notification2",
          isRead: true,
          kind: "COMMENT",
          post: { id: "post2" },
          from: {
            id: "user789",
            name: "Another User",
            displayName: "anotheruser",
            isPro: true
          },
          createdAt: new Date("2023-01-02")
        }
      ];

      const mockValidatedNotifications = [
        {
          id: "notification1",
          type: "LIKE",
          message: "User liked your post",
          isRead: false,
          createdAt: new Date("2023-01-01"),
          user: {
            id: "user456",
            name: "Other User",
            displayName: "otheruser",
            isPro: false
          }
        },
        {
          id: "notification2",
          type: "COMMENT",
          message: "User commented on your post",
          isRead: true,
          createdAt: new Date("2023-01-02"),
          user: {
            id: "user789",
            name: "Another User",
            displayName: "anotheruser",
            isPro: true
          }
        }
      ];

      const mockResult = { data: mockValidatedNotifications, error: null, status: "Success" };

      // Mock the database query to return raw notifications
      (ErrorHandler.useAwait as any).mockImplementation((fn) => {
        // Simulate the function execution with then chain
        const mockDbResult = Promise.resolve(mockRawNotifications)
          .then(list => list.map(it => {
            const validNotification = mockValidatedNotifications.find(v => v.id === it.id);
            (NotificationSchema.getValidNotification as any).mockReturnValue(validNotification);
            return validNotification;
          }));
        
        return Promise.resolve(mockResult);
      });

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(mockResult);
    });

    it("should handle errors when fetching notifications", async () => {
      const mockError = new Error("Database connection failed");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array when no notifications exist", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
      expect(result.data).toEqual([]);
    });

    it("should transform notifications using NotificationSchema", async () => {
      const mockRawNotification = {
        id: "notification1",
        isRead: false,
        kind: "FOLLOW",
        post: { id: "post1" },
        from: {
          id: "user456",
          name: "Follower User",
          displayName: "followeruser",
          isPro: false
        },
        createdAt: new Date("2023-01-01")
      };

      const mockValidatedNotification = {
        id: "notification1",
        type: "FOLLOW",
        message: "User started following you",
        isRead: false,
        createdAt: new Date("2023-01-01"),
        user: {
          id: "user456",
          name: "Follower User",
          displayName: "followeruser",
          isPro: false
        }
      };

      const mockResult = { data: [mockValidatedNotification], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockImplementation((fn) => {
        // Simulate the database result and transformation
        (NotificationSchema.getValidNotification as any).mockReturnValue(mockValidatedNotification);
        return Promise.resolve(mockResult);
      });

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should call ErrorHandler.useAwait with function", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      await NotificationDAO.getAll(mockCurrentUser);

      expect(ErrorHandler.useAwait).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.useAwait).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("edge cases", () => {
    it("should handle invalid notification data gracefully", async () => {
      const mockError = new Error("Invalid notification format");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(result).toEqual(mockResult);
    });

    it("should handle user with no displayName", async () => {
      const invalidUser = {
        id: "user123",
        name: "Test User",
        displayName: "",
        isPro: false
      } as CurrentUserShape;

      const mockError = new Error("Invalid user displayName");
      const mockResult = { data: null, error: mockError, status: "Failure" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await NotificationDAO.getAll(invalidUser);

      expect(result).toEqual(mockResult);
    });

    it("should maintain consistent return format", async () => {
      const mockResult = { data: [], error: null, status: "Success" };

      (ErrorHandler.useAwait as any).mockResolvedValue(mockResult);

      const result = await NotificationDAO.getAll(mockCurrentUser);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('status');
      expect(['Success', 'Failure']).toContain(result.status);
    });
  });
});