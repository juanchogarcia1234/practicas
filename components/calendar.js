import React from "react";
import axios from "axios";
import { startOfMonth, startOfWeek, endOfWeek, startOfDay, addDays, subDays, endOfYear, format, getMonth, getYear, getWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { capitalize } from "underscore.string";
import { formatDateFromDB, formatHour } from "../helpers";
import Info from "./info";
import { months, hours, currentTimePositions } from "../constants";
import Spinner from "./spinner";
import styles from "./menu.module.css";

class Calendar extends React.Component {
  state = {
    currentMonth: getMonth(new Date()),
    currentYear: getYear(new Date()),
    currentDay: new Date(),
    currentWeek: this.getCurrentWeek(),
    currentClasses: [],
    loading: true,
    updateLoading: false,
    classes: []
  };

  isOnlyOneMonth(week) {
    return week.every(day => getMonth(day) === getMonth(week[0]));
  }

  getCurrentMonth(week) {
    return this.isOnlyOneMonth(week) ? getMonth(week[0]) : [getMonth(week[0]), getMonth(week[6])];
  }

  getCurrentMonthName(month) {
    return Array.isArray(month) ? months[month[0]] + " - " + capitalize(months[month[1]]) : months[month];
  }

  getCurrentYear(week) {
    return getYear(week[6]);
  }

  getCurrentWeek(start = new Date()) {
    let currentWeekStart = startOfWeek(startOfDay(start));
    let week = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));
    return week;
  }

  // Returns a function that returns...
  takeWeek(start = new Date()) {
    let currentWeekStart = startOfWeek(startOfDay(start));
    let week = [...Array(7)].map((_, i) => addDays(currentWeekStart, i)); //Esto crea la semana actual entera la primera vez que se llama

    // ...1st the current week 2nd the next week (next 7 days) and so on
    return function (direction) {
      this.setState({ loading: true });
      if (direction === "next") {
        week = [...Array(7)].map((_, i) => addDays(addDays(currentWeekStart, 7), i));
        currentWeekStart = addDays(currentWeekStart, 7); //actualizo el current weekstart si ha dado a next
      } else if (direction === "previous") {
        week = [...Array(7)].map((_, i) => addDays(subDays(currentWeekStart, 7), i));
        currentWeekStart = subDays(currentWeekStart, 7);
      }

      this.setState({ currentMonth: this.getCurrentMonth(week), currentYear: this.getCurrentYear(week) });

      return week;
    };
  }

  checkClassInDay(hour, day, urok) {
    if (formatDateFromDB(day) == formatDateFromDB(new Date(formatDateFromDB(urok.start_time))) && hour.substring(0, 2) == formatHour(urok.start_time).substring(0, 2)) {
      return this.renderClass(formatHour(urok.start_time).substr(3, 2), urok);
    } else {
      return null;
    }
  }

  updateClass(id, student, action, classNumber, classCourse) {
    console.log("pasa por aqui1");

    this.setState({ updateLoading: true });
    console.log("pasa por aqui");
    if (action === "done") {
      console.log("por aqui tambien pasa");
      axios.put("/api/classes", { id: id, action: "done" }).then(response => {
        this.fetchWeekClasses();
      });
    } else if (action === "cancel") {
      //1º PUT: Update cancel to true
      axios.put("/api/classes", { id: id, student: student, action: "cancel", classNumber: classNumber, classCourse: classCourse }).then(response => {
        this.fetchWeekClasses();
      });
      //2º PUT: Update number of rest of classes
      //3º POST: Insert new class with number 8
      //4º this.fetchWeekClasses();
    }
  }

  showCalendarHeader() {
    return this.state.currentWeek.map(date => {
      return (
        <th className={format(date, "E d y") === format(this.state.currentDay, "E d y") ? "current" : ""} style={{ width: "164px" }} id={format(date, "E d y")} key={format(date, "E d y")}>
          {capitalize(format(date, "E d ", { locale: ru }))}
        </th>
      );
    });
  }

  renderClass(startTime, urok) {
    const that = this;
    console.log("funciona o no", urok.start_time);
    return (
      <div className="presentation" key={urok.end_time} data-minutes={startTime}>
        <div className="ui raised  text  segment urok" style={{ paddingTop: 0, position: "relative" }}>
          {this.props.session.user.email === "juan@gmail.com" && (
            <>
              <i
                onClick={e => {
                  e.target.nextSibling.style.display === "none" ? (e.target.nextSibling.style.display = "inline-flex") : (e.target.nextSibling.style.display = "none");
                }}
                className={`fas fa-ellipsis-v grey threePoints`}
                style={{ top: "7px", position: "absolute", right: "5px", cursor: "pointer" }}
              ></i>
              <div class="ui compact segments" style={{ position: "absolute", right: "-84px", top: "-231%", display: "none", zIndex: 999 }}>
                {/* ОТМЕНИТЬ */}
                <div
                  class={`ui segment ${styles.selected}`}
                  style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}
                  onClick={() => {
                    $(`#${urok._id}cancel`)
                      .modal({
                        onApprove: function () {
                          that.updateClass(urok._id, urok.student, "cancel", urok.number, urok.course);
                        },
                        onDeny: function () {
                          console.log("todos casa");
                        }
                      })
                      .modal("show");
                  }}
                >
                  <p>Отменить</p>
                </div>
                <div class="ui modal tiny" id={urok._id + "cancel"}>
                  <div class="header">Отменить урок</div>
                  <div class="content">
                    <p>Ты уверен что хочешь отменить урок?</p>
                  </div>
                  <div class="actions">
                    <div class="ui negative button">Нет</div>
                    <div class="ui positive right labeled icon button">
                      Да
                      <i class="checkmark icon"></i>
                    </div>
                  </div>
                </div>
                {/* ОТМЕНИТЬ */}
                {/* ПЕРЕНЕСТИ */}
                <div
                  class={`ui segment ${styles.selected}`}
                  style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}
                  onClick={() => {
                    $(`#${urok._id}done`)
                      .modal({
                        onApprove: function () {
                          console.log("se muestra");
                          that.updateClass(urok._id, urok.student, "done", urok.number, urok.course);
                        },
                        onDeny: function () {
                          console.log("todos casa");
                        }
                      })
                      .modal("show");
                    $(".ui.calendar").calendar();
                  }}
                >
                  <p>Перенести</p>
                </div>
                <div class="ui modal tiny" id={urok._id + "done"}>
                  <div class="header">Перенести урок</div>
                  <div class="content">
                    <h3 onClick={() => $("#example1").calendar()}>На какое время?</h3>
                    <div class="ui calendar" id="example1" onClick={() => $("#example1").calendar()}>
                      <div class="ui input left icon">
                        <i class="calendar icon"></i>
                        <input type="text" placeholder="Date/Time" />
                      </div>
                    </div>
                  </div>
                  <div class="actions">
                    <div class="ui negative button" onClick={() => console.log("helllo")}>
                      Нет
                    </div>
                    <div class="ui positive right labeled icon button">
                      Да
                      <i class="checkmark icon"></i>
                    </div>
                  </div>
                </div>
                {/* ПЕРЕНЕСТИ */}
                {/* СДЕЛАН */}
                <div
                  class={`ui segment ${styles.selected}`}
                  style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}
                  onClick={() => {
                    $(`#${urok._id}done`)
                      .modal({
                        onApprove: function () {
                          console.log("se muestra");
                          that.updateClass(urok._id, urok.student, "done", urok.number, urok.course);
                        },
                        onDeny: function () {
                          console.log("todos casa");
                        }
                      })
                      .modal("show");
                  }}
                >
                  <p>Проведён</p>
                </div>
                <div class="ui modal tiny" id={urok._id + "done"}>
                  <div class="header">Провести урок</div>
                  <div class="content">
                    <p>Ты уверен что хочешь отметить урок как проведен?</p>
                  </div>
                  <div class="actions">
                    <div class="ui negative button" onClick={() => console.log("helllo")}>
                      Нет
                    </div>
                    <div class="ui positive right labeled icon button">
                      Да
                      <i class="checkmark icon"></i>
                    </div>
                  </div>
                </div>
                {/* СДЕЛАН */}
              </div>
            </>
          )}
          <div style={{ marginBottom: "-3px", marginTop: "3px", fontSize: "12px" }}>
            {urok.student_name} {urok.number}/8
          </div>
          <div className="icons" style={{ fontSize: "11px" }}>
            <i className={`check icon ${urok.done ? "green" : "grey"}`}></i>
            <i className={`share icon ${urok.moved ? "blue" : "grey"}`}></i>
            <i className={`times close icon ${urok.cancelled ? "red" : "grey"}`}></i>
            <i className={`ruble sign icon ${urok.paid ? "green" : "grey"}`}></i>
          </div>
        </div>
      </div>
    );
  }

  fetchWeekClasses() {
    const startDate = this.state.currentWeek[0];
    const endDate = this.state.currentWeek[6];
    endDate.setHours(23);

    // this.props.fetchClasses(this.state.currentWeek, this.props.token);
    axios
      .get("/api/classes", {
        params: {
          startDate,
          endDate
        }
      })
      .then(response => {
        console.log(response);
        this.setState({ classes: response.data.classes });
        this.setState({ loading: false });
        this.setState({ updateLoading: false });
      });
  }

  clickEventListener(e) {
    event.preventDefault();
    if (!e.target.classList.contains("compact") && !e.target.classList.contains("threePoints")) {
      var list = document.getElementsByClassName("compact");
      for (let item of list) {
        item.style.display = "none";
      }
    }
  }

  componentDidMount() {
    document.body.addEventListener("click", this.clickEventListener, false);
    const toRemove = document.getElementsByClassName("threePoints");
    for (let item of toRemove) {
      item.removeEventListener("click", this.clickEventListener);
    }
    this.fetchWeekClasses();
    this.genNextWeek = this.takeWeek();

    //Para que necesito esto?
    // this.setState({ currentWeek: this.genNextWeek() });

    //aqui hacer la llamada para obtener los datos
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.clickEventListener);
  }

  render() {
    return (
      <>
        <h2 style={{ textAlign: "center", color: "#5a5a5a", marginBottom: "20px" }}>Уроки по московскому времени</h2>
        <Info />
        <div className="spinner-container" style={{ paddingBottom: "60px" }}>
          {this.state.loading && <Spinner text="Загружаются уроки..." position="absolute" bg="transparent" />}
          {this.state.updateLoading && <Spinner text="Подождите..." position="absolute" bg="transparent" />}
          <table className="ui celled center aligned unstackable table day eight column">
            <thead>
              <tr>
                <th colSpan="8">
                  <span className="link">
                    {capitalize(this.getCurrentMonthName(this.state.currentMonth))} {this.state.currentYear}
                  </span>
                  <span
                    className="prev link"
                    onClick={() => {
                      this.setState({ currentWeek: this.genNextWeek("previous") }, () => {
                        this.fetchWeekClasses();
                      });
                    }}
                  >
                    <i className="chevron left icon"></i>
                  </span>
                  <span
                    className="next link"
                    onClick={() => {
                      this.setState({ currentWeek: this.genNextWeek("next") }, () => {
                        this.fetchWeekClasses();
                      });
                    }}
                  >
                    <i className="chevron right icon"></i>
                  </span>
                </th>
              </tr>
              <tr>
                <th></th>
                {this.showCalendarHeader()}
              </tr>
            </thead>
            <tbody style={{ position: "relative" }}>
              <div style={{ backgroundColor: "red", height: "2px", width: "87.5%", right: 0, position: "absolute", top: currentTimePositions[this.state.currentDay.toString().substring(16, 20) + "0"] }}></div>
              {hours.map(hour => (
                <tr key={hour} id={hour}>
                  <td>{hour}</td>
                  {this.state.currentWeek.map(day => {
                    return (
                      <td key={day} id={day} className={format(day, "E d y") === format(this.state.currentDay, "E d y") ? "current" : ""}>
                        {this.state.classes.map(lesson => this.checkClassInDay(hour, day, lesson))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

// const mapStateToProps = state => {
//   return { token: state.token, classes: state.classes, dataStatus: state.dataStatus };
// };

export default Calendar;
