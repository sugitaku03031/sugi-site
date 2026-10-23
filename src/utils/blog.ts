import { getEmDashCollection, getTermsForEntries } from "emdash";

type Block = { _type?: string; children?: { text?: string }[] };
type PostLike = { data: { excerpt?: string | null; content?: unknown } };

function getPlainText(post: PostLike): string {
	if (!Array.isArray(post.data.content)) return "";
	return (post.data.content as Block[])
		.filter((b) => b._type === "block")
		.map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}

// 日本語は約500文字/分、英語は約200語/分で概算する
export function getReadingMinutes(post: PostLike): number {
	const text = getPlainText(post);
	const cjk = (text.match(/[\u3000-\u9fff\uff00-\uffef]/g) ?? []).length;
	const words = text.replace(/[\u3000-\u9fff\uff00-\uffef]/g, " ").split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(cjk / 500 + words / 200));
}

// 抜粋が空のときは本文の冒頭を一覧用のプレビューに使う
export function getPreview(post: PostLike, max = 120): string {
	if (post.data.excerpt) return post.data.excerpt;
	const text = getPlainText(post);
	return text.length > max ? `${text.slice(0, max)}…` : text;
}

// ニュース用カテゴリー(updates)の投稿はブログ記事から除く
export async function getBlogPosts(limit: number) {
	const { entries, cacheHint } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 100,
	});
	const categoriesByEntry = await getTermsForEntries(
		"posts",
		entries.map((p) => p.data.id),
		"category",
	);
	const posts = entries
		.filter((p) => !(categoriesByEntry.get(p.data.id) ?? []).some((c) => c.slug === "updates"))
		.slice(0, limit);
	return { posts, cacheHint };
}
