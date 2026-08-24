import type { Dispatch, SetStateAction } from "react";

export type UserRole = "recruiter" | "developer" | "writer";

export type TabName =
  | "profiles"
  | "main"
  | "Skills"
  | "Projects"
  | "About"
  | "Contact Me"
  | "Blog";

export type SetCurrentTab = Dispatch<SetStateAction<TabName>>;
export type SetUser = Dispatch<SetStateAction<UserRole | null>>;

export type StaticAssets = {
  images?: string[];
  videos?: string[];
  fonts?: string[];
  hdris?: string[];
};

export type BlogPost = {
  id: number;
  title: string;
  desc: string;
  fullText: string;
  image: string;
};

/* the mock "title details" shown when a home-screen tile expands */
export type CardMeta = {
  match: number;
  rating: string;
  length: string;
  tags: string[];
};

export type SkillItem = {
  logo: string;
  title: string;
};

