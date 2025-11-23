export const GroupContactNoteDetails = ({ form }: { form: any }) => {
    const formatValue = (value: any): string => {
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') {
            if (value._id && value.firstName && value.lastName) return `${value.firstName} ${value.lastName}`;
            try { return JSON.stringify(value); } catch { return '[Object]'; }
        }
        return String(value);
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(form.formData).map(([key, value]) => {
                    const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return (
                        <div key={key} className="break-words">
                            <label className="text-sm font-medium text-gray-600 block mb-1">{displayKey}</label>
                            <div className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-300">
                                {formatValue(value)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};