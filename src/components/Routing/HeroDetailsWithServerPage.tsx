import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Hero = {
  id: number;
  name: string;
};
function HeroDetailsWithServerPage() {
  const { heroId } = useParams();

  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("RENDER HeroDetails", heroId);

  useEffect(() => {
    if (!heroId) {
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    fetch(`/api/heroes/${heroId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then(setHero)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [heroId]);

  if (loading) {
    return <p> loading ... </p>;
  }

  if (!hero) {
    return <p> No Hero</p>;
  }

  return (
    <>
      <h1>Hero {hero.name}</h1>
      <Link to="/heroes/99/server">Open hero 99 with server</Link>

      <br />
      <Link to="/heroes">back</Link>
    </>
  );
}
export default HeroDetailsWithServerPage;
