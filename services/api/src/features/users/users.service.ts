import { CurrentUserResponse } from "@notes/shared-types";
import { NotFoundError } from "../../utils/errors";
import { GoogleUserInfo } from "../auth/auth.types";
import { UserModel } from "./users.model";
import { usersLogger } from "./users.logger";

export const findOrCreateGoogleUser = async (googleUser: GoogleUserInfo) => {
  const existingUser = await UserModel.findOne({
    "authProviders.google.id": googleUser.sub,
  });

  if (!existingUser) {
    const newUser = await UserModel.create({
      email: googleUser.email,
      emailVerified: googleUser.email_verified,
      authProviders: {
        google: {
          id: googleUser.sub,
        },
      },
      profile: {
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        fullName: googleUser.name,
        avatarUrl: googleUser.picture,
        source: "provider",
      },
      aiContext: {
        preferences: {},
      },
    });

    usersLogger.info(
      { userId: newUser._id },
      "New user registered via Google OAuth",
    );

    return newUser;
  }

  if (existingUser.profile?.source === "provider") {
    existingUser.profile.firstName = googleUser.given_name ?? null;
    existingUser.profile.lastName = googleUser.family_name ?? null;
    existingUser.profile.fullName = googleUser.name ?? null;
    existingUser.profile.avatarUrl = googleUser.picture ?? null;
  }

  existingUser.email = googleUser.email;
  existingUser.emailVerified = googleUser.email_verified;

  await existingUser.save();

  return existingUser;
};

export const getUserMe = async (userId: string): Promise<CurrentUserResponse> => {
  const user = await UserModel.findById(userId)
    .select("email emailVerified profile -_id")
    .lean();

  if (!user) {
    throw new NotFoundError("User");
  }

  return {
    email: user.email,
    emailVerified: user.emailVerified,
    profile: {
      firstName: user.profile?.firstName ?? null,
      lastName: user.profile?.lastName ?? null,
      fullName: user.profile?.fullName ?? null,
      avatarUrl: user.profile?.avatarUrl ?? null,
      source: user.profile?.source ?? "provider",
    },
  };
};
