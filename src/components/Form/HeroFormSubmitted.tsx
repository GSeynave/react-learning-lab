import React, { useState } from "react";

function HeroFormSubmitted() {
  const [form, setForm] = useState({
    name: "",
    level: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent default browser behavior on submit (relaod , navigation)

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/heroes", {
        method: "POST",
        headers: {
          "Content-Type": "applciation/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const createdHero = await response.json();

      console.log(createdHero);
    } catch (error) {
      setError("Could not create hero");
    } finally {
      setLoading(false);
    }
  }

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
    }));
  }

  function updateLevel(level: number) {
    setForm((current) => ({
      ...current,
      level,
    }));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(event) => updateName(event.target.value)}
        />
        <input
          type="number"
          value={form.level}
          onChange={(event) => updateLevel(Number(event.target.value))}
        />

        {loading ? <p>Saving ...</p> : <button type="submit">Save</button>}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default HeroFormSubmitted;
