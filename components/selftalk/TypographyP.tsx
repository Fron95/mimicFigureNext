import React, { ReactNode } from 'react';

interface SthProps {
  children: ReactNode;
}

export default function TypographyP({children} : SthProps) {
    return (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    )
  }
  