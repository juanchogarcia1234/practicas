import Layout from "../../components/layout";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Cancelled({ sessionActiva }) {
  const [session, loading] = useSession();
  const [classes, setClasses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(sesion => {
      if (!sesion) {
        window.location.href = "/login";
      } else {
        axios.get("/api/otmenennye").then(response => {
          setLoading(false);

          console.log("movidas", response);
          setClasses(response.data.classes);
        });
      }
    });
  }, []);

  return (
    <Layout session={sessionActiva} usuario={sessionActiva.user.email}>
      <h2 style={{ textAlign: "center", color: "#5a5a5a" }}>Перенесённые уроки</h2>

      <div className={isLoading ? "ui loading segment" : "ui segment"} style={{ minHeight: "200px" }}>
        {classes.map(urok => {
          return (
            <div className="ui   text  segment " style={{ paddingTop: 0, position: "relative" }}>
              <div style={{ marginBottom: "-3px", marginTop: "3px", fontSize: "12px", display: "flex", justifyContent: "space-evenly", paddingTop: "20px" }}>
                <p>
                  <b>Студент: </b>
                  {urok.student_name}
                </p>
                <p>
                  <b>Класс: </b>
                  {urok.number}/8
                </p>
                <p>
                  <b>Курс: </b>
                  {urok.course}
                </p>
                <p>
                  <b>Начало урока: </b>
                  {urok.start_time}
                </p>
                <p>
                  <b>Конец урока: </b>
                  {urok.end_time}
                </p>
                <p>
                  <b>Причина: </b>
                  {urok.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
