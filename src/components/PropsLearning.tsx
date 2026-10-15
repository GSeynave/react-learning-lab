import Counter from "./Counter";

function PropsLearning() {
  return (
    <>
      <h2>Props Learning</h2>
      <Counter title="Heroes" initialValue={3} />
      <Counter title="Guilds" initialValue={10} />
    </>
  );
}

export default PropsLearning;
