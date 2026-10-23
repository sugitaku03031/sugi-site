import simple from "./brand-icons.json";

export interface BrandIcon {
	path: string;
	color: string;
}

const fromSimple = (icon: { path: string; hex: string }, color = `#${icon.hex}`): BrandIcon => ({
	path: icon.path,
	color,
});

// brand-icons.json は simple-icons (CC0) から抽出。無いブランドは Material Design Icons の path を使う
export const icons = {
	misskey: fromSimple(simple.misskey, "#000000"),
	bluesky: fromSimple(simple.bluesky),
	x: fromSimple(simple.x, "#000000"),
	facebook: fromSimple(simple.facebook),
	instagram: fromSimple(simple.instagram),
	youtube: fromSimple(simple.youtube),
	niconico: fromSimple(simple.niconico, "#6b6b6b"),
	twitch: fromSimple(simple.twitch),
	threads: fromSimple(simple.threads, "#000000"),
	pixiv: fromSimple(simple.pixiv),
	twitcasting: {
		path: "M4.93 4.93C1.03 8.83 1.03 15.17 4.93 19.07l1.41-1.41C3.22 14.54 3.22 9.46 6.34 6.34L4.93 4.93zM19.07 4.93l-1.41 1.41c3.12 3.12 3.12 8.2 0 11.32l1.41 1.41c3.9-3.9 3.9-10.24 0-14.14zM7.76 7.76c-2.34 2.34-2.34 6.14 0 8.48l1.41-1.41c-1.56-1.56-1.56-4.09 0-5.66L7.76 7.76zm8.48 0-1.41 1.41c1.56 1.56 1.56 4.09 0 5.66l1.41 1.41c2.34-2.34 2.34-6.14 0-8.48zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
		color: "#2dcc8f",
	},
} satisfies Record<string, BrandIcon>;

export type IconName = keyof typeof icons;
