import React from 'react';
import { Field, ErrorMessage } from 'formik';

const InputDate = ({ label, name, placeholder, required = true }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={name}>
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <Field
                type="date"
                name={name}
                placeholder={placeholder}
                className="mt-1 block w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:border-gray-600"
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-600 text-sm mt-1 dark:text-red-400"
            />
        </div>
    );
};

export default InputDate;
