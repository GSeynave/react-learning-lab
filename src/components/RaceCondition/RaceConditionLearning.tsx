import { useEffect, useState } from "react";

function fakeSearch(query: string): Promise<string[]> {
  const delay = query === "art" ? 2000 : 300;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([`Result for ${query}`]);
    }, delay);
  });
}

function RaceConditionLearning() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    console.log("START", search);

    fakeSearch(search).then((data) => {
      console.log("FINISH", search);
      setResults(data);
    });
  }, [search]);
  return (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      <ul>
        {results.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </>
  );
}

export default RaceConditionLearning;
