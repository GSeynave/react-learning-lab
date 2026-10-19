import { useEffect, useState } from "react";

function RaceConditionLearning() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(`/api/heroes?search=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        setError("Could not load heroes");
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
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
