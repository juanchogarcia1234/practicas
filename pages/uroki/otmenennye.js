import Layout from "../../components/layout";
import { getSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";

export default function Cancelled() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        window.location.href = "/login";
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <Spinner></Spinner>;
  }
  return (
    <Layout>
      <>Cancelled</>
    </Layout>
  );
}
