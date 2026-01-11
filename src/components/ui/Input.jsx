import './Input.css';

/**
 * Premium input component with floating label
 */
export default function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    error,
    icon,
    className = '',
    ...props
}) {
    const hasValue = value && value.length > 0;

    return (
        <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${className}`}>
            {icon && <span className="input-icon">{icon}</span>}
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder || ' '}
                required={required}
                disabled={disabled}
                className={`input-field ${icon ? 'input-field--with-icon' : ''} ${hasValue ? 'input-field--filled' : ''}`}
                {...props}
            />
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-border"></div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}

/**
 * Textarea component
 */
export function Textarea({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    error,
    rows = 4,
    className = '',
    ...props
}) {
    const hasValue = value && value.length > 0;

    return (
        <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${className}`}>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder || ' '}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`input-field input-field--textarea ${hasValue ? 'input-field--filled' : ''}`}
                {...props}
            />
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-border"></div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}

/**
 * Select component
 */
export function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    error,
    className = '',
    ...props
}) {
    return (
        <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${className}`}>
            <select
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`input-field input-field--select ${value ? 'input-field--filled' : ''}`}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {label && (
                <label htmlFor={name} className="input-label input-label--select">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-border"></div>
            <span className="input-select-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}
