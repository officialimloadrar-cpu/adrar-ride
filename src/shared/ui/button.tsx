import { ButtonHTMLAttributes, forwardRef } from 'react';
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={className} {...props} />
);
Button.displayName = 'Button';
