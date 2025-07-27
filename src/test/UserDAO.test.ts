import type { SignUpShape } from "@business/schema/AuthSchema";
import type { UpdateUserShape } from "@business/schema/UserSchema";
import NotFoundError from "@db/NotFoundError";
import { UserDAO } from "@db/dao/UserDAO";
import { afterEach, assert, describe, expect, it } from "vitest";

class UserDAOTest {
  public static USER_SIGN_UP: SignUpShape = {
    email: "text@example.com",
    password: "Password1234",
    confirmPassword: "Password1234",
    name: "Testing User",
    displayName: "TestUser"
  };

  public static async createOne(credentials = this.USER_SIGN_UP) {
    const result = await UserDAO.createOne(credentials);
    if (result.error) throw result.error;
    return result.data;
  }

  public static async deleteOne(credentials = this.USER_SIGN_UP) {
    const result = await UserDAO.deleteOne(credentials.displayName);
    if (result.error) throw result.error;
    return result;
  }
}

describe("UserDAO", () => {
  afterEach(async () => {
    await UserDAOTest.deleteOne();
  });

  describe("createOne()", () => {
    it("Should return the created User containing their unique uuid", async () => {
      const user = await UserDAOTest.createOne();

      expect(user.id).toBeDefined();
    });
  });

  describe("getOne()", () => {
    it("Should return the User with the given displayName", async () => {
      const user = await UserDAOTest.createOne();
      const foundUser = await UserDAO.getOne(UserDAOTest.USER_SIGN_UP.displayName, null);
      
      assert(foundUser.status === "Success");
      expect(foundUser.data).toBeDefined();
      expect(foundUser.data.id).toEqual(user.id);
    });

    it("Should throw NotFoundError if the User does not exist", async () => {
      const user = await UserDAO.getOne("FakeDisplayName", null);
      
      assert(user.status === "Failure");
      expect(user.error).toBeDefined();
      expect(user.error).toBeInstanceOf(NotFoundError);
    });
  });

  describe("updateOne()", () => {
    const UPDATE_USER_DATA: UpdateUserShape = {
      name: "Damian Lee",
      location: "Test Country",
      description: "Software Developer."
    };

    it("Should update the User with the given displayName", async () => {
      const user = await UserDAOTest.createOne();
      const result = await UserDAO.updateOne(UserDAOTest.USER_SIGN_UP.displayName, UPDATE_USER_DATA);


      assert(result.status === "Success");
      assert(result.data != null);
      expect(result.data).toBeDefined();
      expect(result.data.id).toEqual(user.id);
    });

    it("Should return null if the User does not exist", async () => {
      const result = await UserDAO.updateOne("FakeDisplayName", UPDATE_USER_DATA);
      
      assert(result.status === "Success");
      expect(result.data).toBeNull();
    });
  });

  describe("deleteOne()", () => {
    it("Should delete the User with the given displayName", async () => {
      const user = await UserDAOTest.createOne();
      const result = await UserDAO.deleteOne(UserDAOTest.USER_SIGN_UP.displayName);
      
      assert(result.status === "Success");
      assert(result.data != null);
      expect(result.data.id).toEqual(user.id);
    });

    it("Should return null if the User does not exist", async () => {
      const result = await UserDAO.deleteOne("FakeDisplayName");
      
      assert(result.status === "Success");
      expect(result.data).toBeNull();
    });
  });
});