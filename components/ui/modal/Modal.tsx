import classNames from 'classnames';
import { X } from 'lucide-react';
import React from 'react';
import { ModalProps } from './ModalProps.types';


const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, icon, children, className }) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0   bg-[#292929]/80 flex items-center justify-center p-4 z-50">
            <div
                className={
                    classNames(
                        'bg-white p-4 sm:p-6 md:p-8 lg:p-9 w-full max-w-[800px] rounded-lg shadow-lg relative',
                        className
                    )
                }
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-black cursor-pointer"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="flex flex-col gap-8 items-center  justify-center">
                    {icon}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;