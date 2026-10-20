import { useEffect, useState } from "react";

type ChildProps = {
  roomId: number;
};

function ChildLifecycle({ roomId }: ChildProps) {
  console.log("ChildLifecycle Learning");
  const [count, setCount] = useState(0);

  console.log("RENDER", { roomId, count });

  useEffect(() => {
    console.log("CONNECT", roomId);

    return () => {
      console.log("DISCONNECT", roomId);
    };
  }, [roomId]);

  return (
    <>
      <p>Room: {roomId}</p>
      <p>Count: {count}</p>

      <button onClick={() => setCount((c) => c + 1)}>
        Increment local count
      </button>
    </>
  );
}

export default ChildLifecycle;
