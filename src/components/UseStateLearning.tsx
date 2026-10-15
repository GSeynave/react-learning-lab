import { useEffect, useState } from "react";

function UseStateLearning() {
  let normalCount = 0;

  const [stateCount, setStateCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${stateCount}`;
  }, [stateCount]);

  function incrementNormal() {
    normalCount++;
  }

  function incrementState() {
    setStateCount((current) => current + 1);
  }
  //function incrementState() {
  //setStateCount(stateCount + 1);
  //setStateCount(stateCount + 1);
  //setStateCount(stateCount + 1);
  // will only increment by 1 as each step schedule current value + 1, without updating the current value before rerendering
  //}

  //function incrementState() {
  //setStateCount((current) => current + 1);
  //setStateCount((current) => current + 1);
  //setStateCount((current) => current + 1);
  // will increment by 3 as each step call the latest queued value
  //}

  return (
    <div>
      <h2>Use State learning</h2>
      <p>Normal : {normalCount}</p>
      <button onClick={incrementNormal}>Increment Normal</button>

      <p>State : {stateCount}</p>
      <button onClick={incrementState}>Increment state</button>
    </div>
  );
}

export default UseStateLearning;
