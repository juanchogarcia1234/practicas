import Head from "next/head";
import Layout from "../components/layout";
import Calendar from "../components/calendar";
import { useSession } from "next-auth/client";

export default function Home() {
  const [session, loading] = useSession();
  return (
    <>
      <Layout>
        <Head>
          <title>Уроки</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />
        </Head>
        <Calendar />
      </Layout>
    </>
  );
}
