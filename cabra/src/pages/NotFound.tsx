import "twin.macro";

import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import RandomGoat from "./components/RandomGoat";
import { routeHelpers } from "../routes";

export default function NotFoundPage() {
  return (
    <Layout>
      <Link to={routeHelpers.tasks}>Take me home</Link>
      <RandomGoat />
    </Layout>
  );
}
