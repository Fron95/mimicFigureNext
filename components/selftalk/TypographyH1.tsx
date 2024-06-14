import React, { ReactNode } from 'react';

interface SthProps {
  children: ReactNode;
}

export default function Sth({ children }: SthProps) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}
