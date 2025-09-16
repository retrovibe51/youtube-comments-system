import { relations } from "drizzle-orm/relations";
import { comments, commentReactions, users, videos } from "./schema";

export const commentReactionsRelations = relations(commentReactions, ({one}) => ({
	comment: one(comments, {
		fields: [commentReactions.commentId],
		references: [comments.id]
	}),
	user: one(users, {
		fields: [commentReactions.userId],
		references: [users.id]
	}),
}));

export const commentsRelations = relations(comments, ({one, many}) => ({
	commentReactions: many(commentReactions),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
	video: one(videos, {
		fields: [comments.videoId],
		references: [videos.id]
	}),
	comment: one(comments, {
		fields: [comments.parentCommentId],
		references: [comments.id],
		relationName: "comments_parentCommentId_comments_id"
	}),
	comments: many(comments, {
		relationName: "comments_parentCommentId_comments_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	commentReactions: many(commentReactions),
	comments: many(comments),
}));

export const videosRelations = relations(videos, ({many}) => ({
	comments: many(comments),
}));