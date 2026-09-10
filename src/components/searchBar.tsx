import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks';

interface searchBarProps {
  placeholderText: string;
  handleSearch: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  searchVal: string;
}

export default function SearchBar({
  handleSearch,
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
    <input
      ref={inputRef}
      onInput={handleSearch}
      placeholder={placeholderText}
      value={searchVal}
      className="roboto mb3 f5 f4-ns normal ba br3 pa2"
      autocomplete="off"
    />
  );
}
