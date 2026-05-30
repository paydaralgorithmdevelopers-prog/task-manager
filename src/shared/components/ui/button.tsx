'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { ReactNode } from 'react';

export interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, disabled, ...props }: ButtonProps) {
  return (
    <MuiButton disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
}
