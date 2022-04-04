import "twin.macro";

import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import RandomGoat from "./components/RandomGoat";

export default function NotFoundPage() {
  return (
    <Layout>
      <Link to="/">Take me home</Link>
      <RandomGoat />
    </Layout>
  );
}
