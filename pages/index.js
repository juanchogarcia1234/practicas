import Head from "next/head";
import Layout from "../components/layout";
import Calendar from "../components/calendar";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../components/spinner";
import { useState, useEffect } from "react";

export default function Home() {
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

  console.log("esta es la sesion", session);

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Уроки</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />
        </Head>
        <Calendar session={session} />
      </Layout>
    </>
  );
}
