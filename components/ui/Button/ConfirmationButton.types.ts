import React from 'react';

export interface ConfirmationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "disabledLook" | "outline"
  loading?: boolean;
  loadingPosition?: 'left' | 'right';
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode| string;
}
