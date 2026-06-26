import React from 'react';

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const inputClassName =
  'w-[5.5rem] px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500';

const RangeFilter = ({
  label,
  value,
  onChange,
  step = 'any',
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
}) => {
  const handleChange = (key, raw) => {
    onChange({
      ...value,
      [key]: parseNumber(raw),
    });
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="flex-1 min-w-0 text-xs font-medium text-gray-600 dark:text-gray-400 truncate"
        title={label}
      >
        {label}
      </span>
      <input
        type="number"
        step={step}
        value={value.min ?? ''}
        onChange={(e) => handleChange('min', e.target.value)}
        placeholder={minPlaceholder}
        className={inputClassName}
        aria-label={`${label} ${minPlaceholder}`}
      />
      <span className="text-gray-400 text-xs shrink-0">—</span>
      <input
        type="number"
        step={step}
        value={value.max ?? ''}
        onChange={(e) => handleChange('max', e.target.value)}
        placeholder={maxPlaceholder}
        className={inputClassName}
        aria-label={`${label} ${maxPlaceholder}`}
      />
    </div>
  );
};

export default RangeFilter;
