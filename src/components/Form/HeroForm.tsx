import { useState } from "react";

function HeroForm() {
  const [form, setForm] = useState({
    name: "",
    level: 1,
  });

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
      <input
        value={form.name}
        onChange={(event) => updateName(event.target.value)}
      />
      <input
        type="number"
        value={form.level}
        onChange={(event) => updateLevel(Number(event.target.value))}
      />

      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}

export default HeroForm;
