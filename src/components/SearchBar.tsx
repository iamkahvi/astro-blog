import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks';

interface searchBarProps {
  placeholderText: string;
  handleSearch: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  handleClear: () => void;
  searchVal: string;
}

export default function SearchBar({
  handleSearch,
  handleClear,
  placeholderText,
  searchVal,
}: searchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlashShortcut = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleSlashShortcut);
    return () => window.removeEventListener("keydown", handleSlashShortcut);
  }, []);

  return (
    <div className="search-bar mb3">
      <input
        ref={inputRef}
        onInput={handleSearch}
        placeholder={placeholderText}
        value={searchVal}
        className="roboto f5 f4-ns normal ba br3 pa2"
        autocomplete="off"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const input = document.currentScript?.previousElementSibling;
              if (!(input instanceof HTMLInputElement)) return;

              const params = new URLSearchParams(window.location.search);
              const query = params.get("q") ?? params.get("search") ?? "";
              input.value = query;
              input.defaultValue = query;
            })();
          `,
        }}
      />
      {searchVal && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
