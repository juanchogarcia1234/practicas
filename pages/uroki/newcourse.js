import Layout from "../../components/layout";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

export default function newCourse({ sessionActiva }) {
  const [chosenUser, setChosenUser] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then(sesion => {
      if (!sesion) {
        window.location.href = "/login";
      } else {
        let usersArray = [];

        //Get users
        axios.get("/api/users").then(response => {
          response.data.users.forEach(element => usersArray.push({ name: element.email, value: element.email, selected: "" }));
          usersArray[0].selected = true;

          $(".ui.dropdown").dropdown({
            values: usersArray,
            action: "hide",
            onChange: function (value, text, $selectedItem) {
              console.log("este es el valor y el texto", value, text);
              setChosenUser(value);
            }
          });
        });
      }
    });
  }, [isLoading]);

  return (
    <Layout session={sessionActiva} usuario={sessionActiva.user.email}>
      <Head>
        <title>Добавить курс</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />
        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js" integrity="sha512-dqw6X88iGgZlTsONxZK9ePmJEFrmHwpuMrsUChjAw1mRUhUITE5QU9pkcSox+ynfLhL15Sv2al5A0LVyDCmtUw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.js"></script>
      </Head>
      <h2 style={{ textAlign: "center", color: "#5a5a5a" }}>Добавить курс</h2>

      <div className="ui segment" style={{ minHeight: "200px", textAlign: "center", paddingTop: "30px" }}>
        <h3 style={{ textAlign: "center", color: "#5a5a5a" }}>Студент</h3>

        <div class="ui selection dropdown">
          <div class="value">{chosenUser}</div>
          <i class="dropdown icon"></i>
        </div>
        <button
          onClick={() => {
            $("#addStudent")
              .modal({
                onApprove: function () {
                  setLoading(true);
                  axios.post("/api/users", { student: document.getElementById("inputname").value, password: document.getElementById("inputpassword").value }).then(response => {
                    setLoading(false);
                  });
                },
                onDeny: function () {}
              })
              .modal("show");
          }}
          class={!isLoading ? "ui primary large button" : "ui primary large button loading"}
          style={{ margin: "0 auto", display: "block", marginTop: "10px" }}
        >
          Добавить студент
        </button>
        <div class="ui modal tiny" id="addStudent">
          <div class="header">Новый студент</div>
          <div class="content">
            <p>Имя</p>

            <div class="ui input" onChange={() => console.log("hello")}>
              <input type="text" placeholder="" id="inputname" />
            </div>
            <p style={{ marginTop: "20px" }}>Пароль</p>
            <div class="ui input">
              <input type="text" placeholder="" id="inputpassword" />
            </div>
          </div>
          <div class="actions">
            <div class="ui negative button">Нет</div>
            <div class="ui positive right labeled icon button">
              Да
              <i class="checkmark icon"></i>
            </div>
          </div>
        </div>
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
