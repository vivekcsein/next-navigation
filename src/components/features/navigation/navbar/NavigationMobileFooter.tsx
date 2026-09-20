"use client";

import Image from "next/image";
import Link from "next/link";
import { Link as UILink } from "@/components/ui";
import appConfig from "@/packages/configs/app.config";
import type { User } from "@/types/user";

type NavigationMobileFooterProps = {
  /** Signed-in user. Omit (or pass null) for the guest state: Sign in / Sign up. */
  user?: User | null;
  /** Called when any link inside is followed — pass the drawer's close handler. */
  onNavigate?: () => void;
  /** Wire to your sign-out action later. Only shown for a signed-in user. */
  onSignOut?: () => void;
};

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const GuestAvatar = () => (
  <span className="mobile-footer-avatar" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <title>Guest</title>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

/**
 * NavigationMobileFooter.tsx
 * --------------------------------------------------------------
 * Pinned footer of the mobile nav drawer: a profile section plus the
 * account actions. Presentational only — no auth is wired up yet.
 *
 *  - Guest (default):  profile teaser + [Sign in] [Sign up]
 *  - Signed in:        profile card linking to the profile page + [Sign out]
 *
 * Try the signed-in state by passing a user:
 *   <NavigationMobileFooter user={{ name: "Vivek Kumar", email: "v@x.dev" }} />
 *
 * Styles: `.mobile-footer*` in styles/ui/navigation.css.
 */
const NavigationMobileFooter = ({
  user = null,
  onNavigate,
  onSignOut,
}: NavigationMobileFooterProps) => {
  const { signIn, signUp, profile } = appConfig.routes.auth;

  if (user) {
    return (
      <div className="mobile-footer">
        <Link
          href={profile}
          className="mobile-footer-profile"
          onClick={onNavigate}
        >
          {user.avatarUrl ? (
            <Image
              className="mobile-footer-avatar"
              src={user.avatarUrl}
              alt=""
              width={40}
              height={40}
            />
          ) : (
            <span className="mobile-footer-avatar" aria-hidden="true">
              {getInitials(user.name)}
            </span>
          )}
          <span className="mobile-footer-identity">
            <span className="mobile-footer-name">{user.name}</span>
            {user.email && (
              <span className="mobile-footer-sub">{user.email}</span>
            )}
          </span>
        </Link>

        <button
          type="button"
          className="mobile-footer-signout"
          onClick={() => {
            onSignOut?.();
            onNavigate?.();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-footer">
      <div className="mobile-footer-profile mobile-footer-profile-guest">
        <GuestAvatar />
        <span className="mobile-footer-identity">
          <span className="mobile-footer-name">Welcome</span>
          <span className="mobile-footer-sub">
            Sign in to save your preferences
          </span>
        </span>
      </div>

      <div className="mobile-footer-actions">
        <UILink
          variant="secondary-button"
          href={signIn}
          className="w-full"
          onClick={onNavigate}
        >
          Sign in
        </UILink>
        <UILink
          variant="primary-button"
          href={signUp}
          className="w-full"
          onClick={onNavigate}
        >
          Sign up
        </UILink>
      </div>
    </div>
  );
};

export default NavigationMobileFooter;
