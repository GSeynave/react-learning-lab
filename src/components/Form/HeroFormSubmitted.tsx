import React, { useState } from "react";

function HeroFormSubmitted() {
  const [form, setForm] = useState({
    name: "",
    level: 1,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent default browser behavior on submit (relaod , navigation)

    console.log("Submitting", form);
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

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default HeroFormSubmitted;
