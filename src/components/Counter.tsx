import { useEffect, useState } from "react";

type CounterProps = {
  title: string;
  initialValue: number;
};

function Counter({ title, initialValue }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <section>
      <h2>{title}</h2>
      <p>{count}</p>

      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </section>
  );
}

export default Counter;
