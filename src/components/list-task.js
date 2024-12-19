"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/helper/axios";
import Link from "next/link";

const FILTERS = {
  all: "All",
  completed: "Completed",
  uncompleted: "Uncompleted",
};

export default function ListTask() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const getParam = () => {
    let param = {};
    if (filter != "all") {
      const completed = filter == "completed" ? true : false;
      param = { completed };
    }
    return param;
  };

  const getTasks = () => {
    const param = getParam();
    setActionMessage("Loading...");
    axiosInstance
      .get("/tasks", {
        params: param,
      })
      .then((res) => {
        setActionMessage("");
        if (res.data) {
          const modifiedTasks = res.data?.data?.map((i) => ({
            ...i,
            checked: i.completed,
          }));
          setTasks(modifiedTasks);
        }
      })
      .catch((err) => {
        setActionMessage("Something went wrong!");
        setTimeout(() => {
          setActionMessage("");
        }, 5000);
        console.log({ err });
        alert("Something went wrong!");
      });
  };

  useEffect(() => {
    getTasks();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target?.value || "all");
  };

  const handleTaskChecked = (value, item) => {
    const id = item.id;
    const modifiedTasks = tasks.map((i) => {
      if (i.id == id) return { ...i, checked: value };
      return i;
    });
    setTasks(modifiedTasks);

    setActionMessage("Updating...");
    axiosInstance
      .put(`/tasks/${id}`, {
        completed: value,
      })
      .then((res) => {
        setActionMessage("");
        console.log("Update success!");
      })
      .catch((err) => {
        getTasks();
        setActionMessage("Something went wrong!");
        setTimeout(() => {
          setActionMessage("");
        }, 5000);
        console.log({ err });
        alert("Something went wrong!");
      });
  };

  const handleDeleteTask = (item) => {
    const id = item.id;
    const modifiedTasks = tasks.filter((i) => i.id != id);
    setTasks(modifiedTasks);
    setActionMessage("Deleting...");
    axiosInstance
      .delete(`/tasks/${id}`)
      .then((res) => {
        setActionMessage("Task deleted");
        setTimeout(() => {
          setActionMessage("");
        }, 2000);
      })
      .catch((err) => {
        getTasks();
        setActionMessage("Something went wrong!");
        setTimeout(() => {
          setActionMessage("");
        }, 5000);
        console.log({ err });
        alert("Something went wrong!");
      });
  };

  return (
    <div className="">
      <div className="flex gap-4 py-5">
        <h4 className="font-bold text-lg">Your Tasks</h4>
        <div className="flex justify-center items-center">
          <p>Filter:</p>
          <select onChange={handleFilterChange}>
            {Object.entries(FILTERS).map(([value, label], i) => (
              <option key={i} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center mb-1">
        <p className="italic">{actionMessage}</p>
        <Link href="/manage">
          <button className="bg-blue-500 px-2 py-0.5 text-white rounded">
            Add
          </button>
        </Link>
      </div>
      <divc className="">
        {tasks.map((i) => {
          return (
            <div
              key={i.id}
              className="px-4 py-1 border boder-gray-100 mb-1 rounded-lg flex justify-between"
            >
              <div className="flex gap-2">
                <input
                  checked={i.checked}
                  onChange={(e) => {
                    const value = e.target.checked;
                    handleTaskChecked(value, i);
                  }}
                  type="checkbox"
                ></input>
                <p className={i.checked ? "line-through" : ""}>{i.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/manage?id=${i.id}`}>
                  <button className="flex bg-white items-center justif-center">
                    <svg
                      fill="#40C057"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 30"
                      width="20px"
                      height="20px"
                    >
                      <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z" />
                    </svg>
                  </button>
                </Link>
                <button
                  disabled={disableButton}
                  onClick={() => handleDeleteTask(i)}
                  className="bg-white flex items-center justify-center"
                >
                  <svg
                    fill="#FA5252"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20px"
                    height="20px"
                  >
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </divc>
    </div>
  );
}
