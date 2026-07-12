import { forwardRef, useState, type InputHTMLAttributes } from "react";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function PasswordInput({ className, ...rest }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="auth-input-wrap">
        <input
          {...rest}
          ref={ref}
          type={visible ? "text" : "password"}
          className={className ?? "auth-input"}
        />
        <button
          type="button"
          className="auth-toggle"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "HIDE" : "SHOW"}
        </button>
      </div>
    );
  }
);
