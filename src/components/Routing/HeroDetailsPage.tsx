import { Link, useParams } from "react-router-dom";

function HeroDetailsPage() {
  const { heroId } = useParams();
  console.log("RENDER HeroDetails", heroId);

  return (
    <>
      <h1>Hero {heroId}</h1>
      <Link to="/heroes/99">Open hero 99</Link>

      <br />

      <Link to="/heroes">Back</Link>
    </>
  );
}
export default HeroDetailsPage;
