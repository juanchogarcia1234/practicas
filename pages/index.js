import Head from "next/head";
import Layout from "../components/layout";
import Calendar from "../components/calendar";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../components/spinner";
import { useState, useEffect } from "react";

export default function Home({ sessionActiva }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, loading] = useSession();
  useEffect(() => {
    getSession().then(sesion => {
      if (!sesion) {
        window.location.href = "/login";
      } else {
        setIsLoading(false);
        //Aqui haríamos la llamada para traer las clases
      }
    });
  }, []);

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  return (
    <>
      <Layout session={sessionActiva} usuario={sessionActiva.user.email}>
        <Head>
          <title>Уроки</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />
          <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js" integrity="sha512-dqw6X88iGgZlTsONxZK9ePmJEFrmHwpuMrsUChjAw1mRUhUITE5QU9pkcSox+ynfLhL15Sv2al5A0LVyDCmtUw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
          <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.js"></script>
        </Head>
        <Calendar session={session} />
      </Layout>
    </>
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
