'use client';

import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { ReactNode } from 'react';

export interface CardProps extends MuiCardProps {
  children: ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return <MuiCard {...props}>{children}</MuiCard>;
}
