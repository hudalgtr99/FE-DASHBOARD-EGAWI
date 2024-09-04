import React from 'react';
import { Field } from 'formik';

const InputEmail = ({ label, name, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <Field
            name={name}
            type="email"
            placeholder={placeholder}
            className="mt-1 block w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:border-gray-600"
        />
    </div>
);

export default InputEmail;
