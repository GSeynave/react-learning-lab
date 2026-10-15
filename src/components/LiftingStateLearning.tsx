import { useState } from "react";
import Counter from "./Counter";

// =====================================
// Search bar
// =====================================
type SearchBarProps = {
  value: string;
  onSearchChange: (value: string) => void;
};

function SearchBar({ value, onSearchChange }: SearchBarProps) {
  return (
    <input
      value={value}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search heroes..."
    />
  );
}

// =====================================
// Hero List
// =====================================

type HeroListProps = {
  search: string;
};

function HeroList({ search }: HeroListProps) {
  const heroes = ["Arthas", "Jaina", "Thrall", "Sylvanas"];

  const filteredHeroes = heroes.filter((hero) =>
    hero.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ul>
      {filteredHeroes.map((hero) => (
        <li key={hero}>{hero}</li>
      ))}
    </ul>
  );
}

function LiftingStateLearning() {
  const [search, setSearch] = useState("");
  return (
    <>
      <h2>Lifting State Learning</h2>
      <SearchBar value={search} onSearchChange={setSearch} />

      <HeroList search={search} />
    </>
  );
}

export default LiftingStateLearning;
