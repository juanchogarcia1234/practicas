import React from "react";
import axios from "axios";
import { startOfMonth, startOfWeek, endOfWeek, startOfDay, addDays, subDays, endOfYear, format, getMonth, getYear, getWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { capitalize } from "underscore.string";
import { formatDateFromDB, formatHour } from "../helpers";
import Info from "./info";
import { months, hours, currentTimePositions } from "../constants";
import Spinner from "./spinner";

class Calendar extends React.Component {
  state = {
    currentMonth: getMonth(new Date()),
    currentYear: getYear(new Date()),
    currentDay: new Date(),
    currentWeek: this.getCurrentWeek(),
    currentClasses: [],
    loading: true,
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

  updateClass(id, action) {}

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
                className={`fas fa-ellipsis-v grey`}
                style={{ top: "7px", position: "absolute", right: "5px", cursor: "pointer" }}
              ></i>
              <div class="ui compact segments" style={{ position: "absolute", right: "-65px", top: "-231%", display: "none" }}>
                <div
                  class="ui segment"
                  style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}
                  onClick={() => {
                    $(`#${urok._id}cancel`)
                      .modal({
                        onApprove: function () {
                          console.log("esta funcionando brother");
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
                <div class="ui segment" style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}>
                  <p>Перенести</p>
                </div>
                <div
                  class="ui segment"
                  style={{ padding: "10px", fontSize: "12px", cursor: "pointer" }}
                  onClick={() => {
                    $(`#${urok._id}done`).modal("show");
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
      });
  }

  componentDidMount() {
    this.fetchWeekClasses();
    this.genNextWeek = this.takeWeek();

    //Para que necesito esto?
    // this.setState({ currentWeek: this.genNextWeek() });

    //aqui hacer la llamada para obtener los datos
  }

  componentDidUpdate() {}

  render() {
    console.log("dia de hoy", currentTimePositions[this.state.currentDay.toString().substring(16, 20) + "0"]);
    console.log("dia de hoy sin current position", this.state.currentDay.toString().substring(16, 20) + "0");

    return (
      <>
        <Info />
        <h2 style={{ textAlign: "center", color: "#5a5a5a" }}>Московское время</h2>
        <div className="spinner-container" style={{ paddingBottom: "60px" }}>
          {this.state.loading && <Spinner text="Загружаются уроки..." position="absolute" bg="transparent" />}
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
