import type NextLink from "next/link";
import type { ComponentProps } from "react";
import * as React from "react";
import { cn } from "@/packages/utils/cn";
import PrimaryButtonLink from "./PrimaryButtonLink";
import PrimaryLink from "./PrimaryLink";
import SecondaryButtonLink from "./SecondaryButtonLink";
import SecondaryLink from "./SecondaryLink";

const linkVariants = {
  primary: PrimaryLink,
  secondary: SecondaryLink,
  "primary-button": PrimaryButtonLink,
  "secondary-button": SecondaryButtonLink,
} as const;

export type LinkVariant = keyof typeof linkVariants;

export type LinkUnderline = "center" | "left" | "right";

export interface LinkProps extends ComponentProps<typeof NextLink> {
  variant?: LinkVariant;
  underline?: LinkUnderline;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { variant = "primary", underline = "left", className, children, ...props },
    ref,
  ) => {
    const LinkComponent = linkVariants[variant];

    if (variant === "primary") {
      return (
        <LinkComponent
          ref={ref}
          underline={underline}
          className={cn(className)}
          {...props}
        >
          {children}
        </LinkComponent>
      );
    }

    return (
      <LinkComponent ref={ref} className={cn(className)} {...props}>
        {children}
      </LinkComponent>
    );
  },
);

Link.displayName = "Link";

export { Link };
