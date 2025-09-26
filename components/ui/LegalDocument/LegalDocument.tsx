"use client";
import React from 'react';
import { LegalDocumentProps } from './LegalDocumentProps.types';
import Link from 'next/link';
import { useTranslatedText } from '@/domain/translation/presentation/getTranslatedText';

const LegalDocument: React.FC<LegalDocumentProps> = ({
    title,
    paragraphs,
}) => {

    const translatedText = useTranslatedText();
    return (
        <div>
            <div className='gap-1.5 px-6 md:px-10 lg:px-[50px] py-7.5'>
                <h1 className="text-[30px] font-[600] text-[#000000]">
                    {title}
                </h1>
                <div className=' lg:pr-[330px] flex flex-col gap-6 mt-3'>
                    {paragraphs?.map((section, index) => (
                        <div key={index} className="text-black text-[14px] font-[400px]">
                            <p>{section}</p>
                        </div>
                    ))}
                </div>

                <Link
                    href="/"
                    passHref
                    className='bg-[#2463EB] text-white w-full h-full max-h-[48px] py-[14px] rounded-lg my-4 max-w-[120px] flex items-center justify-center font-[600] text-[16px]'

                >

                    {translatedText?.legalDocumentDoneButton ?? "Done"}
                </Link>

            </div>
        </div>);
};

export default LegalDocument;