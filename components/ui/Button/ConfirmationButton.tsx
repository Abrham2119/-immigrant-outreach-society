import classNames from 'classnames';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { ConfirmationButtonProps } from './ConfirmationButton.types';

export const ConfirmationButton = React.forwardRef<HTMLButtonElement, ConfirmationButtonProps>(
  (
    {
      loading = false,
      loadingPosition = 'right',
      className = '',
      disabled,
      onClick,
      variant = 'disabledLook',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const LoadingSpinner = () => <Loader2 className="animate-spin" />;

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick();
      }
    };

    return (
      <div className="w-full flex items-center justify-center">
        <button
          ref={ref}
          type="button"
          className={classNames(
            className,
            'text-base text-nowrap  py-3.5 flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out text-center',
            isDisabled
              ? 'opacity-70 cursor-not-allowed border-none bg-[#A0A0A0] text-white hover:bg-[#A0A0A0]'
              : 'cursor-pointer',
            !loading && variant === 'outline'
              ? 'border text-base   bg-transparent hover:bg-[#2463EB] hover:text-white text-[#3F434A] border-[#2463EB]  w-[295px]'
              : ' border-[#99999980] border text-[#99999980] font-medium text-sm',
            className.includes('w-') ? '' : 'w-full',
            className.includes('h-') ? '' : 'h-full'
          )}
          disabled={isDisabled}
          aria-busy={loading}
          onClick={handleClick}
          {...props}
        >
          {loading && loadingPosition === 'left' && <LoadingSpinner />}
          {children}
          {loading && loadingPosition === 'right' && <LoadingSpinner />}
        </button>
      </div>
    );
  }
);

ConfirmationButton.displayName = 'ConfirmationButton';
