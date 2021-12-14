import Layout from "../../components/layout";
import { getSession, useSession } from "next-auth/client";
import Spinner from "../../components/spinner";
import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { mappingWeekDays, immutableSplice, mappingWeekDaysNumbers } from "../../constants";
import { getDay, formatISO } from "date-fns";
import { daysMapping, getNextArrElement } from "../../helpers";
import { toDate } from "date-fns-tz";

export default function newCourse({ sessionActiva }) {
  //Usuario elegido
  const [chosenUser, setChosenUser] = useState("");
  //Dias de la semana
  const [weekDays, setWeekDays] = useState([]);
  //Cuantos días = weekDays.length
  //Horas de las clases
  const [weekHours, setWeekHours] = useState([]);
  //Start date
  const [startDate, setStartDate] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingCourses, setLoadingCourses] = useState(false);

  function isClicked(day) {
    return weekDays.includes(day) ? true : false;
  }

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
          $("#standard_calendar").calendar({
            onHide: () => {
              setStartDate($("#standard_calendar").calendar("get date").toString());
            }
          });
          weekDays.forEach(day =>
            $(`#${day}time`).calendar({
              ampm: false,
              type: "time",
              onHide: function () {
                console.log("fis1", weekHours);

                console.log("fis", $(`#${day}time`).calendar("get date").toString().substr(16, 5));
                console.log("sec", [...weekHours, $(`#${day}time`).calendar("get date").toString().substr(16, 5)]);

                setWeekHours([...weekHours, $(`#${day}time`).calendar("get date").toString().substr(16, 5)]);
              }
            })
          );
        });
      }
    });
  }, [isLoading, weekDays, weekHours]);

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
        {/* SELECT STUDENT */}
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
        {/* SELECT START DATE */}
        <br />
        <h3 style={{ textAlign: "center", color: "#5a5a5a" }}>Когда первый урок?</h3>
        <div class="ui calendar" id="standard_calendar">
          <div class="ui input left icon">
            <i class="calendar icon"></i>
            <input type="text" placeholder="Date/Time" />
          </div>
        </div>{" "}
        <br />
        {/* SELECT DAYS */}
        <h3 style={{ textAlign: "center", color: "#5a5a5a" }} onClick={() => console.log(startDate)}>
          Выбирай дни уроков
        </h3>
        <div class="ui circular labels" style={{ marginTop: "20px" }}>
          <a id="L" class={isClicked("L") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("L") ? setWeekDays(weekDays.filter(e => e !== "L")) : setWeekDays(immutableSplice(weekDays, 0, 0, document.getElementById("L").innerText)))}>
            L
          </a>
          <a id="M" class={isClicked("M") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("M") ? setWeekDays(weekDays.filter(e => e !== "M")) : setWeekDays(immutableSplice(weekDays, 1, 0, document.getElementById("M").innerText)))}>
            M
          </a>
          <a id="X" class={isClicked("X") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("X") ? setWeekDays(weekDays.filter(e => e !== "X")) : setWeekDays(immutableSplice(weekDays, 2, 0, document.getElementById("X").innerText)))}>
            X
          </a>
          <a id="J" class={isClicked("J") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("J") ? setWeekDays(weekDays.filter(e => e !== "J")) : setWeekDays(immutableSplice(weekDays, 3, 0, document.getElementById("J").innerText)))}>
            J
          </a>
          <a id="V" class={isClicked("V") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("V") ? setWeekDays(weekDays.filter(e => e !== "V")) : setWeekDays(immutableSplice(weekDays, 4, 0, document.getElementById("V").innerText)))}>
            V
          </a>
          <a id="S" class={isClicked("S") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("S") ? setWeekDays(weekDays.filter(e => e !== "S")) : setWeekDays(immutableSplice(weekDays, 5, 0, document.getElementById("S").innerText)))}>
            S
          </a>
          <a id="D" class={isClicked("D") ? "ui label green" : "ui label"} onClick={() => (weekDays.includes("D") ? setWeekDays(weekDays.filter(e => e !== "D")) : setWeekDays(immutableSplice(weekDays, 6, 0, document.getElementById("D").innerText)))}>
            D
          </a>
        </div>
        {/* SELECT CLASS HOUR */}
        {weekDays.map(day => {
          return (
            <>
              <h3 key={day} style={{ textAlign: "center", color: "#5a5a5a" }}>
                Во сколько урок в {mappingWeekDays[day]}?
              </h3>
              <div class="ui calendar" id={`${day}time`}>
                <div class="ui input left icon">
                  <i class="time icon"></i>
                  <input type="text" placeholder="Time" />
                </div>
              </div>
              <br />
            </>
          );
        })}
        <br />
        <button
          class={!isLoadingCourses ? "positive ui button big" : "positive ui button big loading"}
          onClick={() => {
            setLoadingCourses(true);
            //Get last course
            axios.get("/api/courses", { params: { student: chosenUser } }).then(res => {
              console.log("NUMERO DE CURSOS", res.data.courses.length);
              let courseNumber = res.data.courses.length === 0 ? 1 : res.data.courses[0].number + 1;
              console.log("esto es del browser sin formatear", new Date(startDate));
              console.log("esto es del browser formatISO", formatISO(new Date(startDate)));

              console.log("esto es del browser formateada toISo", toDate(new Date(startDate), { timeZone: "Europe/Riga" }).toISOString());

              axios
                .post("/api/courses", {
                  student: chosenUser,
                  startDate: formatISO(new Date(startDate)),
                  weekDays,
                  weekHours,
                  numberOfClasses: weekDays.length,
                  number: courseNumber
                })
                .then(res => {
                  console.log("esto es lo que hace formatISO", formatISO(new Date(startDate)));
                  //1 Creo la primera clase con el startDate
                  axios
                    .post("/api/classes", {
                      student: chosenUser,
                      startDate: formatISO(new Date(startDate)),
                      endDate: formatISO(new Date(startDate).setHours(new Date(startDate).getHours() + 1)),
                      courseNumber,
                      day: mappingWeekDaysNumbers[getDay(new Date(startDate))],
                      number: 1
                    })
                    .then(res => {
                      let currentClass = new Date(startDate);
                      let currentNumber = 1;

                      [...Array(7)].forEach((_, i) => {
                        console.log("CURRENT CLASS", currentClass);
                        const nextClassDay = getNextArrElement(weekDays.indexOf(mappingWeekDaysNumbers[getDay(currentClass)]), weekDays);
                        //Change the current class
                        currentClass = daysMapping[nextClassDay](currentClass);
                        //Change current class number
                        currentNumber += 1;
                        //Aqui hago la llamada
                        axios.post("/api/classes", {
                          student: chosenUser,
                          startDate: formatISO(currentClass),
                          courseNumber,
                          day: nextClassDay,
                          number: currentNumber
                        });
                        console.log("clase una por una", nextClassDay);
                      });

                      setLoadingCourses(false);
                    });

                  //2 Veo que dia de la semana es la primera clase y lo comparo con el array
                  console.log("Este es el dia de la primera clase", mappingWeekDaysNumbers[getDay(new Date(startDate))]);
                  const nextClassDay = getNextArrElement(weekDays.indexOf(mappingWeekDaysNumbers[getDay(new Date(startDate))]), weekDays);
                  console.log("Esta va a ser el dia de la siguiente clase", nextClassDay);
                  const nextClass = daysMapping[nextClassDay](new Date(startDate));
                  console.log("Esta va a ser la siguiente clase", nextClass);
                  //3 Cojo el siguiente elemento del array de weekDays y veo que dia es el nextX para crear la siguiente clase
                  console.log(res);
                });
            });
            console.log("Student", chosenUser);
            console.log("Start Date", startDate);
            console.log("Week Days", weekDays);
            console.log("Weeks Hours", weekHours);
            console.log("Number of Classes", weekDays.length);
          }}
        >
          Добавить курс
        </button>
        <br />
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
