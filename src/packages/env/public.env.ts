import { z } from "zod";

const publicEnvSchema = z.object({
  // App
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("vivekcsein"),

  NEXT_PUBLIC_APP_VERSION: z.string().trim().min(1).default("3.0.0"),

  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .trim()
    .min(1)
    .default(
      "A portfolio full stack developer with a passion for building scalable and high-performance web applications.",
    ),

  // Site
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  NEXT_PUBLIC_SITE_TITLE: z.string().trim().min(1).default("Vivek's Portfolio"),

  NEXT_PUBLIC_LOGO_URL: z.string().trim().min(1).default("logo.png"),

  NEXT_PUBLIC_OG_IMAGE_URL: z.string().trim().optional(),

  // Theme
  NEXT_PUBLIC_ACTIVE_THEME: z
    .enum(["system", "light", "dark"])
    .default("system"),

  // Social
  NEXT_PUBLIC_TWITTER: z.url().default("https://twitter.com/vivekcsein"),

  NEXT_PUBLIC_LINKEDIN: z
    .url()
    .default("https://www.linkedin.com/showcase/vivekcsein"),

  NEXT_PUBLIC_GITHUB: z.url().default("https://github.com/vivekcsein"),

  // Author
  NEXT_PUBLIC_AUTHOR_NAME: z.string().trim().min(1).default("vivekcsein"),

  NEXT_PUBLIC_AUTHOR_EMAIL: z.email().default("ivivekcse@gmail.com"),

  NEXT_PUBLIC_GOOGLE_VERIFICATION: z
    .string()
    .trim()
    .min(1)
    .default("google-verification-code"),
});

const parsedPublicEnv = publicEnvSchema.safeParse(process.env);

if (!parsedPublicEnv.success) {
  console.error("❌ Invalid public environment variables:");

  for (const issue of parsedPublicEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  throw new Error("Public environment validation failed");
}

const publicEnv = parsedPublicEnv.data;

export const envPublicConfig = Object.freeze({
  // App
  APP_NAME: publicEnv.NEXT_PUBLIC_APP_NAME,
  APP_VERSION: publicEnv.NEXT_PUBLIC_APP_VERSION,
  APP_DESCRIPTION: publicEnv.NEXT_PUBLIC_APP_DESCRIPTION,

  // Site
  SITE_URL: publicEnv.NEXT_PUBLIC_SITE_URL,
  SITE_TITLE: publicEnv.NEXT_PUBLIC_SITE_TITLE,

  LOGO_URL: publicEnv.NEXT_PUBLIC_LOGO_URL,
  OG_IMAGE_URL: publicEnv.NEXT_PUBLIC_OG_IMAGE_URL,

  // Theme
  ACTIVE_THEME: publicEnv.NEXT_PUBLIC_ACTIVE_THEME,

  // Social
  TWITTER: publicEnv.NEXT_PUBLIC_TWITTER,
  LINKEDIN: publicEnv.NEXT_PUBLIC_LINKEDIN,
  GITHUB: publicEnv.NEXT_PUBLIC_GITHUB,

  // Author
  AUTHOR_NAME: publicEnv.NEXT_PUBLIC_AUTHOR_NAME,
  AUTHOR_EMAIL: publicEnv.NEXT_PUBLIC_AUTHOR_EMAIL,

  // Google verification
  GOOGLE_VERIFICATION: publicEnv.NEXT_PUBLIC_GOOGLE_VERIFICATION,
});

export type EnvPublicConfig = typeof envPublicConfig;
