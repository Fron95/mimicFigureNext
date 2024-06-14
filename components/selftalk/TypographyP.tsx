import React, { ReactNode } from 'react';

export default function TypographyP({children}) {
    return (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    )
  }
  