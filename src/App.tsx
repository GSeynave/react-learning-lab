import UseStateLearning from "./components/UseStateLearning";
import UseEffectLearning from "./components/UseEffectLearning.tsx";
import PropsLearning from "./components/PropsLearning.tsx";
import LiftingStateLearning from "./components/LiftingStateLearning.tsx";
import FormLearning from "./components/Form/FormLearning.tsx";

function App() {
  return (
    <div>
      <UseStateLearning />
      <UseEffectLearning />
      <PropsLearning />
      <LiftingStateLearning />
      <FormLearning />
    </div>
  );
}

export default App;
