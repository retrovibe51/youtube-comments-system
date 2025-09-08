import { pgTable, unique, serial, varchar, foreignKey, integer, boolean, timestamp, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 100 }).notNull(),
	username: varchar({ length: 30 }).notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),
]);

export const comments = pgTable("comments", {
	id: serial().primaryKey().notNull(),
	content: varchar({ length: 1000 }).notNull(),
	userId: integer("user_id").notNull(),
	videoId: integer("video_id").notNull(),
	parentCommentId: integer("parent_comment_id"),
	isEdited: boolean("is_edited").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_fkey"
		}),
	foreignKey({
			columns: [table.videoId],
			foreignColumns: [videos.id],
			name: "comments_video_id_fkey"
		}),
	foreignKey({
			columns: [table.parentCommentId],
			foreignColumns: [table.id],
			name: "comments_parent_comment_id_fkey"
		}),
]);

export const videos = pgTable("videos", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 1000 }),
	mediaUrl: varchar("media_url", { length: 2048 }).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const commentReactions = pgTable("comment_reactions", {
	id: serial().primaryKey().notNull(),
	commentId: integer("comment_id").notNull(),
	userId: integer("user_id").notNull(),
	reactionType: varchar("reaction_type", { length: 10 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.commentId],
			foreignColumns: [comments.id],
			name: "comment_reactions_comment_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comment_reactions_user_id_fkey"
		}),
	unique("comment_reactions_comment_id_user_id_key").on(table.commentId, table.userId),
	check("comment_reactions_reaction_type_check", sql`(reaction_type)::text = ANY ((ARRAY['like'::character varying, 'dislike'::character varying])::text[])`),
]);
