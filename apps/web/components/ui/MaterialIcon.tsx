import React from "react";

interface MaterialIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = "",
  size = 20,
}) => {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center leading-none ${className}`}
      style={{ fontSize: `${size}px` }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};
