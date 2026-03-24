import { InferSchemaType } from "mongoose";
import { userSchema } from "./users.model";

export type User = InferSchemaType<typeof userSchema>;
