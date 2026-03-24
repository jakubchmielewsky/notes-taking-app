import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    fullName: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    source: {
      type: String,
      enum: ["provider", "user"],
      default: "provider",
    },
  },
  { _id: false },
);

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    authProviders: {
      google: {
        id: { type: String },
      },
    },
    profile: {
      type: profileSchema,
      required: true,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { "authProviders.google.id": 1 },
  { unique: true, sparse: true },
);

export const UserModel = model("User", userSchema);
