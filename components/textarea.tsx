import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label?: string;
  name?: string;
  register?: UseFormRegisterReturn;

  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  required,

  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <textarea
        {...register}
        required={required}
        id={name}
        className="mt-1 w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
        rows={4}
        {...rest}
      />
    </div>
  );
}
