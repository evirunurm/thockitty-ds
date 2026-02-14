import React, { useRef } from "react";
import { useButton } from "@react-aria/button";
import type { AriaButtonProps } from "@react-aria/button";

export interface ButtonProps extends AriaButtonProps<"button"> {
  className?: string;
  style?: React.CSSProperties;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLButtonElement>) ?? localRef;
    const { buttonProps } = useButton(props, ref);
    const { children, className, style } = props;

    return (
      <button {...buttonProps} ref={ref} className={className} style={style}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
