import type { JSX } from 'preact'

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
  return (
    <input
      onInput={handleSearch}
      placeholder={placeholderText}
      value={searchVal}
      className="roboto mb3 f5 f4-ns normal ba br3 pa2"
      autocomplete="off"
    />
  );
}
