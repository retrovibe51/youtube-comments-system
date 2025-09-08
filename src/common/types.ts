import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, comments, commentReactions, videos } from 'src/database/schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type CommentReaction = InferSelectModel<typeof commentReactions>;
export type NewCommentReaction = InferInsertModel<typeof commentReactions>;

export type Video = InferSelectModel<typeof videos>;
export type NewVideo = InferInsertModel<typeof videos>;
