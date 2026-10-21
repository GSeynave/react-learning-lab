import { Link } from "react-router-dom";

function HeroesPage() {
  return (
    <>
      <h1>Heroes</h1>
      <Link to="/heroes/42">Open hero 42</Link>
      <Link to="/heroes/42/server">Open hero 42 with server</Link>
    </>
  );
}
export default HeroesPage;
