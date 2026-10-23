export const languages = ["ja", "en"] as const;
export type Lang = (typeof languages)[number];

const fallbackLang: Lang = "en";

// Accept-Language を q 値の高い順に見て、最初に対応している言語を返す
export function getLang(request: Request): Lang {
	const header = request.headers.get("accept-language") ?? "";
	const candidates = header
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
			return { base: (tag ?? "").toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1 };
		})
		.filter((c) => c.q > 0)
		.sort((a, b) => b.q - a.q);
	for (const { base } of candidates) {
		const match = languages.find((l) => l === base);
		if (match) return match;
	}
	return fallbackLang;
}

const ui = {
	ja: {
		dateLocale: "ja-JP",
		search: "検索",
		home: "ホーム",
		news: "ニュース",
		blog: "ブログ",
		posts: "投稿",
		about: "概要",
		categories: "カテゴリー",
		tags: "タグ",
		recentPosts: "最近の投稿",
		tagPrefix: "タグ",
		categoryPosts: (label: string) => `${label} の投稿`,
		taggedPosts: (label: string) => `「${label}」タグの投稿`,
		noPosts: "投稿はまだありません。",
		noPostsCategory: "このカテゴリーの投稿はまだありません。",
		noPostsTag: "このタグの投稿はまだありません。",
		noNews: "お知らせはまだありません。",
		noBlog: "記事はまだありません。",
		createOne: "作成する",
		firstPage: "最初のページ",
		nextPage: "次のページ",
		pagination: "ページネーション",
		notFoundTitle: "ページが見つかりません",
		notFoundBody: "お探しのページは存在しません。",
		goHome: "ホームへ戻る",
		newsDescription: "ホームページの更新情報・お知らせ",
		blogDescription: "ブログ記事の一覧",
		readingTime: (min: number) => `約${min}分で読めます`,
		pastBlogTitle: "過去のブログ",
		pastBlogBody: "はてなブログで書いていた過去の記事は、以下で読めます。",
		pastBlogLink: "はてなブログを開く",
	},
	en: {
		dateLocale: "en-US",
		search: "Search",
		home: "Home",
		news: "News",
		blog: "Blog",
		posts: "Posts",
		about: "About",
		categories: "Categories",
		tags: "Tags",
		recentPosts: "Recent Posts",
		tagPrefix: "Tag",
		categoryPosts: (label: string) => `Posts in ${label}`,
		taggedPosts: (label: string) => `Posts tagged "${label}"`,
		noPosts: "No posts yet.",
		noPostsCategory: "No posts in this category yet.",
		noPostsTag: "No posts with this tag yet.",
		noNews: "No news yet.",
		noBlog: "No posts yet.",
		createOne: "Create one",
		firstPage: "First page",
		nextPage: "Next page",
		pagination: "Pagination",
		notFoundTitle: "Page not found",
		notFoundBody: "The page you're looking for doesn't exist.",
		goHome: "Go home",
		newsDescription: "Site updates and announcements",
		blogDescription: "All blog posts",
		readingTime: (min: number) => `${min} min read`,
		pastBlogTitle: "Past blog",
		pastBlogBody: "Older posts written on Hatena Blog are available here.",
		pastBlogLink: "Open Hatena Blog",
	},
} as const;

export function useT(lang: Lang) {
	return ui[lang];
}

const menuKeys: Record<string, "home" | "news" | "blog" | "posts" | "about"> = {
	"/": "home",
	"/news": "news",
	"/blog": "blog",
	"/posts": "posts",
	"/about": "about",
};

export function localizeMenuLabel(lang: Lang, url: string, label: string) {
	const key = menuKeys[url];
	return key ? ui[lang][key] : label;
}

const termLabels: Record<string, Record<Lang, string>> = {
	general: { ja: "一般", en: "General" },
	updates: { ja: "更新情報", en: "Updates" },
};

export function localizeTerm(lang: Lang, slug: string, label: string) {
	return termLabels[slug]?.[lang] ?? label;
}
