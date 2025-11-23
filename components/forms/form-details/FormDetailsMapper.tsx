import { assessmentForms } from '@/domain/constants/assessmentForms';
import {
    ContactNoteDetails,
    DischargeSummaryDetails,
    GeneralIntakeDetails,
    GroupContactNoteDetails,
    IntakeAssessmentDetails,
    PsychosocialInterventionDetails,
    PsychosocialIntakeDetails
} from './index';

interface FormDetailsMapperProps {
    form: any;
    formType: string;
}

export const FormDetailsMapper: React.FC<FormDetailsMapperProps> = ({ form, formType }) => {
    switch (formType) {
        case assessmentForms[0].id:
            return <ContactNoteDetails form={form} />;
        case assessmentForms[1].id:
            return <DischargeSummaryDetails form={form} />;
        case assessmentForms[2].id:
            return <GeneralIntakeDetails form={form} />;
        case assessmentForms[3].id:
            return <GroupContactNoteDetails form={form} />;
        case assessmentForms[4].id:
            return <IntakeAssessmentDetails form={form} />;
        case assessmentForms[5].id:
            return <PsychosocialInterventionDetails form={form} />;
        case assessmentForms[6].id:
            return <PsychosocialIntakeDetails form={form} />;
        default:
            return <DefaultFormDetails form={form} />;
    }
};

const DefaultFormDetails = ({ form }: { form: any }) => {
    const formatValue = (value: any): string => {
        if (Array.isArray(value)) {
            return value.map(item => formatValue(item)).join(', ');
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (typeof value === 'object') {
            if (value._id && value.firstName && value.lastName) {
                return `${value.firstName} ${value.lastName}`;
            }
            try {
                return JSON.stringify(value);
            } catch {
                return '[Object]';
            }
        }
        return String(value);
    };

    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Form Data</h3>
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(form.formData).map(([key, value]) => {
                        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const displayValue = formatValue(value);

                        return (
                            <div key={key} className="break-words">
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                    {displayKey}
                                </label>
                                <div className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-300">
                                    {displayValue}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};