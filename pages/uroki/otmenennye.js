import Layout from "../../components/layout";
import { getSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";

export default function Cancelled() {
  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        window.location.href = "/login";
      } else {
      }
    });
  }, []);

  return (
    <Layout>
      <>Cancelled</>
    </Layout>
  );
}
