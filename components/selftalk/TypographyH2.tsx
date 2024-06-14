import React, { ReactNode } from 'react';

interface SthProps {
  children: ReactNode;
}

export default function TypographyH2({children} : SthProps ) {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    )
  }
  