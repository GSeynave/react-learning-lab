import { useState } from "react";
import ChildLifecycle from "./ChildLifecycle";

function LifecycleLearning() {
  console.log("Lifecycle Learning");
  const [roomId, setRoomId] = useState(10);
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button onClick={() => setRoomId((id) => id + 10)}>Change room</button>

      <button onClick={() => setVisible((v) => !v)}>Toggle child</button>

      {visible && <ChildLifecycle roomId={roomId} />}
    </>
  );
}

export default LifecycleLearning;
