import classNames from 'classnames';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { ButtonProps } from './Button.types';


export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            loading = false,
            loadingPosition = 'right',
            className = '',
            disabled,
            onClick,
            variant = 'primary',
            children,
            ...props
        }, ref
    ) => {
        const isDisabled = disabled || loading;

        const LoadingSpinner = () => (
            <Loader2 className="animate-spin" />
        );

        const handleClick = () => {
            if (!isDisabled && onClick) {
                onClick();
            }
        };

        return (
            <div className=' w-full  flex items-center justify-center '>
                <button
                    ref={ref}
                    className={classNames(className,
                        'text-base  text-nowrap rounded-lg max-w-[400px] max-h-[48px] py-3.5 flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out text-center',
                        isDisabled
                            ? 'opacity-70 cursor-not-allowed border-none bg-[#A0A0A0] text-white hover:bg-[#A0A0A0]'
                            : 'cursor-pointer',
                        !isDisabled && variant === 'outline'
                            ? 'border text-base border-[#2463EB] bg-transparent hover:bg-[#2463EB] hover:text-white'
                            : (!isDisabled ? 'bg-[#2463EB] text-white text-base ' : ''),
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

Button.displayName = 'Button';
