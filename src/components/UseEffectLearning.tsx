import { useEffect, useState } from "react";

function UseEffectLearning() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  console.log("RENDER", { count, message });

  useEffect(() => {
    console.log("EFFECT", count);

    setMessage(`Current count value is ${count}`);
  }, [count]);
  // Better to turn this useEffect like follow :
  const betterMessage = `Current count is : ${count}`;

  // infinite loop as value is constantly changing in between render
  //useEffect(() => {
  //setMessage(message + "!");
  //}, [message]);
  return (
    <div>
      <h2>Use Effect learning</h2>
      <p>State : {count}</p>
      <p>{message}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

export default UseEffectLearning;
