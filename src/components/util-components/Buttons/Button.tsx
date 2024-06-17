import { ReactNode, useState, useRef, useEffect } from "react";
import { commonButton } from "./Button.css";
import { sprinkles } from "../../../styles/sprinkles.css";
import HoverTooltip from "../HoverTooltip/HoverTooltip";
import { tooltipVisible } from "../HoverTooltip/HoverTooltip.css";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

interface ButtonHoverProps extends ButtonProps {
  tooltipText: ReactNode;
  tooltipInteractive: boolean;
}

export const Button = ({ onClick, children, ...rest }: ButtonProps) => {
  return (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export const ButtonHoverable = ({
  onClick,
  tooltipText,
  tooltipInteractive,
  children,
}: ButtonHoverProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  const handlePointerEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500);
  };

  const handlePointerLeave = () => {
    if (!timeoutRef.current) return null;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  const handleTooltipPointerEnter = () => {
    if (!timeoutRef.current) return null;
    if (tooltipInteractive) {
      clearTimeout(timeoutRef.current);
      setIsHovered(true);
    }
  };
  const handleTooltipPointerLeave = () => {
    if (!timeoutRef.current) return null;
    if (tooltipInteractive) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      });
    }
  };

  return (
    <div className={sprinkles({ position: "relative" })}>
      <HoverTooltip
        onPointerEnter={handleTooltipPointerEnter}
        onPointerLeave={handleTooltipPointerLeave}
        buttonRef={buttonRef}
        className={isHovered ? tooltipVisible : ""}
      >
        {tooltipText}
      </HoverTooltip>
      <button
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        ref={buttonRef}
        className={commonButton}
      >
        {children}
      </button>
    </div>
  );
};
