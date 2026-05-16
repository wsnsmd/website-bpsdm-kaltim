// src/db/schema/index.ts
import {
  mysqlTable,
  varchar,
  text,
  longtext,
  int,
  boolean,
  timestamp,
  datetime,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { mysqlEnum } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

// ═══════════════════════════════════════════
// 1. USERS
// ═══════════════════════════════════════════
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    // Data dari Authentik JWT
    sub: varchar("sub", { length: 255 }).notNull(), // JWT sub
    username: varchar("username", { length: 100 }).notNull(), // preferred_username
    name: varchar("name", { length: 255 }).notNull(),
    givenName: varchar("given_name", { length: 100 }),
    familyName: varchar("family_name", { length: 100 }),
    email: varchar("email", { length: 255 }),
    emailVerified: boolean("email_verified").default(false),
    image: varchar("image", { length: 500 }),
    // Groups dari Authentik → disimpan sebagai JSON
    authentikGroups: text("authentik_groups"), // JSON array
    // Role yang di-resolve dari groups
    role: mysqlEnum("role", ["superadmin", "admin", "editor", "viewer"])
      .default("viewer")
      .notNull(),
    status: mysqlEnum("status", ["active", "inactive", "suspended"])
      .default("active")
      .notNull(),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    subIdx: uniqueIndex("users_sub_idx").on(t.sub),
    emailIdx: index("users_email_idx").on(t.email),
    usernameIdx: index("users_username_idx").on(t.username),
    roleIdx: index("users_role_idx").on(t.role),
  }),
);

// ═══════════════════════════════════════════
// 2. ROLES & PERMISSIONS
// ═══════════════════════════════════════════
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull(),
  group: varchar("group", { length: 100 }),
  description: text("description"),
});

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: int("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: int("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: int("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  }),
);

// ═══════════════════════════════════════════
// 3. AUTH SESSIONS (NextAuth)
// ═══════════════════════════════════════════
export const sessions = mysqlTable(
  "sessions",
  {
    sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
  }),
);

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 100 }).notNull(),
    provider: varchar("provider", { length: 100 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 100 }),
    scope: varchar("scope", { length: 500 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdx: index("accounts_user_idx").on(t.userId),
  }),
);

// ═══════════════════════════════════════════
// 4. CATEGORIES & TAGS
// ═══════════════════════════════════════════
export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    description: text("description"),
    parentId: int("parent_id"),
    type: mysqlEnum("type", ["post", "program", "document"])
      .default("post")
      .notNull(),
    color: varchar("color", { length: 20 }),
    icon: varchar("icon", { length: 100 }),
    sortOrder: int("sort_order").default(0),
    isVisible: boolean("is_visible").default(true),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugTypeIdx: uniqueIndex("categories_slug_type_idx").on(t.slug, t.type),
    parentIdx: index("categories_parent_idx").on(t.parentId),
  }),
);

export const tags = mysqlTable(
  "tags",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description"),
    usageCount: int("usage_count").default(0),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("tags_slug_idx").on(t.slug),
  }),
);

// ═══════════════════════════════════════════
// 5. POSTS / BERITA
// ═══════════════════════════════════════════
export const posts = mysqlTable(
  "posts",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    featuredImage: varchar("featured_image", { length: 1000 }),
    featuredImageAlt: varchar("featured_image_alt", { length: 255 }),
    featuredImageCaption: text("featured_image_caption"),
    authorId: varchar("author_id", { length: 36 }).references(() => users.id),
    authorName: varchar("author_name", { length: 255 }),
    status: mysqlEnum("status", ["draft", "review", "published", "archived"])
      .default("draft")
      .notNull(),
    publishedAt: datetime("published_at"),
    categoryId: int("category_id").references(() => categories.id),
    // WordPress migration
    wpPostId: int("wp_post_id"),
    wpSlug: varchar("wp_slug", { length: 500 }),
    // Stats
    viewCount: int("view_count").default(0),
    readingTime: int("reading_time").default(0),
    // Flags
    isFeatured: boolean("is_featured").default(false),
    isPinned: boolean("is_pinned").default(false),
    // SEO
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    metaKeywords: varchar("meta_keywords", { length: 500 }),
    canonicalUrl: varchar("canonical_url", { length: 1000 }),
    ogImage: varchar("og_image", { length: 1000 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("posts_slug_idx").on(t.slug),
    wpSlugIdx: index("posts_wp_slug_idx").on(t.wpSlug),
    statusIdx: index("posts_status_idx").on(t.status),
    publishedIdx: index("posts_published_idx").on(t.publishedAt),
    categoryIdx: index("posts_category_idx").on(t.categoryId),
    featuredIdx: index("posts_featured_idx").on(t.isFeatured),
  }),
);

export const postTags = mysqlTable(
  "post_tags",
  {
    postId: int("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: int("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.tagId] }),
    tagIdx: index("post_tags_tag_idx").on(t.tagId),
  }),
);

// ═══════════════════════════════════════════
// 8. PROGRAM DIKLAT
// ═══════════════════════════════════════════
export const programs = mysqlTable(
  "programs",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    // Ini yang digunakan untuk filter ke SIMPEL API
    jenisKey: varchar("jenis_key", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 100 }),
    color: varchar("color", { length: 50 }),
    status: mysqlEnum("status", ["active", "inactive"])
      .default("active")
      .notNull(),
    isHighlight: boolean("is_highlight").default(true),
    sortOrder: int("sort_order").default(0),
    objectives: text("objectives"),
    target: text("target"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("programs_slug_idx").on(t.slug),
    jenisIdx: index("programs_jenis_idx").on(t.jenisKey),
    statusIdx: index("programs_status_idx").on(t.status),
  }),
);

export const schedules = mysqlTable(
  "schedules",
  {
    id: int("id").autoincrement().primaryKey(),
    programId: int("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    batchName: varchar("batch_name", { length: 255 }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    registrationStart: datetime("registration_start"),
    registrationEnd: datetime("registration_end"),
    mode: mysqlEnum("mode", ["online", "offline", "blended"]).notNull(),
    location: varchar("location", { length: 500 }),
    virtualPlatform: varchar("virtual_platform", { length: 200 }),
    quota: int("quota").notNull(),
    registeredCount: int("registered_count").default(0),
    status: mysqlEnum("status", [
      "draft",
      "open",
      "closed",
      "full",
      "ongoing",
      "completed",
      "cancelled",
    ])
      .default("draft")
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    programIdx: index("schedules_program_idx").on(t.programId),
    startDateIdx: index("schedules_start_date_idx").on(t.startDate),
    statusIdx: index("schedules_status_idx").on(t.status),
  }),
);

export const registrations = mysqlTable(
  "registrations",
  {
    id: int("id").autoincrement().primaryKey(),
    scheduleId: int("schedule_id")
      .notNull()
      .references(() => schedules.id),
    userId: varchar("user_id", { length: 36 }).references(() => users.id),
    participantName: varchar("participant_name", { length: 255 }).notNull(),
    participantNip: varchar("participant_nip", { length: 20 }),
    participantEmail: varchar("participant_email", { length: 255 }).notNull(),
    participantPhone: varchar("participant_phone", { length: 20 }),
    participantUnit: varchar("participant_unit", { length: 300 }),
    participantPosition: varchar("participant_position", { length: 300 }),
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "completed",
    ])
      .default("pending")
      .notNull(),
    notes: text("notes"),
    registeredAt: timestamp("registered_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    approvedAt: datetime("approved_at"),
    cancelledAt: datetime("cancelled_at"),
  },
  (t) => ({
    scheduleIdx: index("registrations_schedule_idx").on(t.scheduleId),
    userIdx: index("registrations_user_idx").on(t.userId),
    statusIdx: index("registrations_status_idx").on(t.status),
  }),
);

// ═══════════════════════════════════════════
// 9. DOKUMEN
// ═══════════════════════════════════════════
export const documents = mysqlTable(
  "documents",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    description: text("description"),
    fileUrl: varchar("file_url", { length: 1000 }).notNull(),
    fileName: varchar("file_name", { length: 300 }),
    fileSize: int("file_size"),
    fileType: varchar("file_type", { length: 50 }),
    categoryId: int("category_id").references(() => categories.id),
    type: mysqlEnum("type", [
      "laporan",
      "sop",
      "panduan",
      "peraturan",
      "materi",
      "formulir",
      "surat-edaran",
      "lainnya",
    ]).default("lainnya"),
    isPublic: boolean("is_public").default(true),
    downloadCount: int("download_count").default(0),
    publishedAt: datetime("published_at"),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("published")
      .notNull(),
    uploadedBy: varchar("uploaded_by", { length: 36 }).references(
      () => users.id,
    ),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("documents_slug_idx").on(t.slug),
    typeIdx: index("documents_type_idx").on(t.type),
    statusIdx: index("documents_status_idx").on(t.status),
  }),
);

// ═══════════════════════════════════════════
// 10. PENGUMUMAN
// ═══════════════════════════════════════════
export const announcements = mysqlTable(
  "announcements",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    content: text("content"),
    url: varchar("url", { length: 1000 }),
    type: mysqlEnum("type", ["info", "warning", "urgent", "event"]).default(
      "info",
    ),
    showInTicker: boolean("show_in_ticker").default(true),
    showInBanner: boolean("show_in_banner").default(false),
    priority: int("priority").default(0),
    startDate: datetime("start_date").notNull(),
    endDate: datetime("end_date"),
    isActive: boolean("is_active").default(true),
    createdBy: varchar("created_by", { length: 36 }).references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    activeIdx: index("ann_active_idx").on(t.isActive),
    dateIdx: index("ann_date_idx").on(t.startDate),
    tickerIdx: index("ann_ticker_idx").on(t.showInTicker),
  }),
);

// ═══════════════════════════════════════════
// 11. SETTINGS
// ═══════════════════════════════════════════
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 200 }).primaryKey(),
  value: text("value"),
  type: mysqlEnum("type", [
    "string",
    "number",
    "boolean",
    "json",
    "html",
  ]).default("string"),
  group: varchar("group", { length: 100 }).default("general"),
  label: varchar("label", { length: 255 }),
  isPublic: boolean("is_public").default(false),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── Pages (seperti WordPress pages) ──────────
export const pages = mysqlTable(
  "pages",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: longtext("content"),
    excerpt: text("excerpt"),
    template: varchar("template", { length: 100 }).default("default"),
    parentId: int("parent_id"),
    featuredImage: varchar("featured_image", { length: 500 }),
    status: mysqlEnum("status", ["published", "draft", "archived"])
      .default("published")
      .notNull(),
    sortOrder: int("sort_order").default(0),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: varchar("meta_description", { length: 500 }),
    showInNav: boolean("show_in_nav").default(false),
    createdBy: varchar("created_by", { length: 36 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("pages_slug_idx").on(t.slug),
    statusIdx: index("pages_status_idx").on(t.status),
    parentIdx: index("pages_parent_idx").on(t.parentId),
  }),
);

// ── Menu Groups ───────────────────────────────
export const menuGroups = mysqlTable(
  "menu_groups",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    location: varchar("location", { length: 100 }).default("header"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("menu_groups_slug_idx").on(t.slug),
  }),
);

// ── Menu Items ────────────────────────────────
export const menuItems = mysqlTable(
  "menu_items",
  {
    id: int("id").autoincrement().primaryKey(),
    menuGroupId: int("menu_group_id").notNull(),
    parentId: int("parent_id"),
    label: varchar("label", { length: 255 }).notNull(),
    url: varchar("url", { length: 500 }),
    pageId: int("page_id"),
    target: varchar("target", { length: 20 }).default("_self"),
    icon: varchar("icon", { length: 100 }),
    sortOrder: int("sort_order").default(0),
    isActive: boolean("is_active").default(true),
  },
  (t) => ({
    groupIdx: index("menu_items_group_idx").on(t.menuGroupId),
    parentIdx: index("menu_items_parent_idx").on(t.parentId),
  }),
);

// ── Units (Bidang/Unit Kerja) ─────────────────
export const units = mysqlTable(
  "units",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 50 }),
    description: text("description"),
    parentId: int("parent_id"),
    level: int("level").default(0), // 0=pimpinan, 1=sekretariat, 2=bidang, dst
    sortOrder: int("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    parentIdx: index("units_parent_idx").on(t.parentId),
  }),
);

// ── Staff (Pegawai) ───────────────────────────
export const staff = mysqlTable(
  "staff",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nip: varchar("nip", { length: 30 }),
    position: varchar("position", { length: 255 }).notNull(), // jabatan
    unitId: int("unit_id"),
    type: mysqlEnum("type", [
      "kepala_badan",
      "sekretaris",
      "kepala_bidang",
      "widyaiswara",
      "pegawai",
    ]).notNull(),
    photo: varchar("photo", { length: 500 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    education: varchar("education", { length: 255 }), // pendidikan terakhir
    bio: text("bio"),
    sortOrder: int("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    unitIdx: index("staff_unit_idx").on(t.unitId),
    typeIdx: index("staff_type_idx").on(t.type),
    activeIdx: index("staff_active_idx").on(t.isActive),
  }),
);

// ═══════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════
export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  posts: many(posts),
  sessions: many(sessions),
  accounts: many(accounts),
  registrations: many(registrations),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  permissions: many(rolePermissions),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  tags: many(postTags),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  posts: many(posts),
}));

export const programsRelations = relations(programs, ({ many }) => ({
  schedules: many(schedules),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  program: one(programs, {
    fields: [schedules.programId],
    references: [programs.id],
  }),
  registrations: many(registrations),
}));

export const menuGroupsRelations = relations(menuGroups, ({ many }) => ({
  items: many(menuItems),
}));
