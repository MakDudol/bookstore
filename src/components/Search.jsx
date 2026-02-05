import { forwardRef } from "react";
import "./Search.css";

const DEFAULT_PLACEHOLDER = "Пошук за назвою чи автором";
const DEFAULT_ARIA = "Пошук книжок";

const Search = forwardRef(function Search(
  {
    value,
    onChange,
    placeholder = DEFAULT_PLACEHOLDER,
    ariaLabel = DEFAULT_ARIA,
    variant = "full",
    className = "",
    ...inputProps
  },
  inputRef,
) {
  const classes = ["search", variant ? `search--${variant}` : "", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        {...inputProps}
      />
    </div>
  );
});

export default Search;
