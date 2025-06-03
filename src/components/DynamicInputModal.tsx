import React from 'react';

interface InputField {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
}

interface DynamicInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: InputField[];
  confirmText?: string;
  cancelText?: string;
}

export default function DynamicInputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  confirmText = 'Submit',
  cancelText = 'Cancel'
}: DynamicInputModalProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    // Initialize values when fields change
    const initialValues = fields.reduce((acc, field) => {
      acc[field.id] = field.value || '';
      return acc;
    }, {} as Record<string, string>);
    setValues(initialValues);
  }, [fields]);

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col">
                <label 
                  htmlFor={field.id} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}