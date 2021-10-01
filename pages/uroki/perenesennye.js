import Layout from "../../components/layout";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";

export default function Moved({ sessionActiva }) {
  const [session, loading] = useSession();

  useEffect(() => {
    getSession().then(sesion => {
      if (!sesion) {
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <Layout session={sessionActiva} usuario={sessionActiva.user.email}>
      <>Moved</>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const sessionActiva = await getSession({ req: context.req });
  console.log("LLAMANDO A GETSERVERSIDEPROPS");
  console.log(sessionActiva);
  return {
    props: { sessionActiva }
  };
}
