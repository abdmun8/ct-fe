"use client";

import axiosInstance from "@/helper/axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const defaultState = {
  title: "",
  description: "",
  completed: false,
};

export default function FormTask() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [formData, setFormData] = useState(defaultState);
  const [actionMessage, setActionMessage] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [formError, setFormError] = useState({
    title: false,
  });

  const handleSetForm = (name, value) => {
    if (name == "title") {
      setFormError({ title: false });
    }
    setFormData((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const updateTask = (id) => {
    setActionMessage("updating...");
    axiosInstance
      .put("/tasks/" + id, formData)
      .then((res) => {
        setActionMessage("Update success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
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

  const saveData = () => {
    if (!formData.title) {
      setFormError({ title: true });
      return;
    }

    setDisableButton(true);

    if (id) {
      return updateTask(id);
    }

    setActionMessage("Creating...");
    axiosInstance
      .post(`/tasks/`, formData)
      .then((res) => {
        setFormData(defaultState);
        setDisableButton(false);
        setActionMessage("Task created!");
        setTimeout(() => {
          setActionMessage("");
        }, 2000);
      })
      .catch((err) => {
        setDisableButton(false);
        setActionMessage("Something went wrong!");
        setTimeout(() => {
          setActionMessage("");
        }, 5000);
        console.log({ err });
        alert("Something went wrong!");
      });
  };

  const getTask = (id) => {
    setActionMessage("Loading...");
    axiosInstance
      .get("/tasks/" + id)
      .then((res) => {
        setActionMessage("");
        if (res.data) {
          const { title, description, completed } = res.data.data;
          setFormData({
            title,
            description,
            completed,
          });
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
    if (id) {
      getTask(id);
    }
  }, [id]);

  return (
    <div className="">
      <h4 className="font-bold text-lg text-center">New Task</h4>
      <p className="italic">{actionMessage}</p>
      <form className="mb-2">
        <div className="flex flex-col">
          <label>Title</label>
          <input
            minLength={1}
            className="border border-gray-400"
            value={formData.title}
            required
            type="text"
            name="title"
            placeholder="Please input title"
            onChange={(e) => handleSetForm("title", e.target.value)}
          />
          <p className="text-red-500">
            {formError.title && "Title is required"}
          </p>
        </div>
        <div className="flex flex-col items-start">
          <label>Description</label>
          <textarea
            value={formData.description}
            rows={5}
            name="description"
            className="border border-gray-400 w-full"
            onChange={(e) => handleSetForm("description", e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-3">
          <Link href="/">
            <button className="px-2 py-0.5 rounded underline" type="button">
              Back
            </button>
          </Link>
          <button
            type="submit"
            disabled={disableButton}
            className="bg-blue-500 px-2 py-0.5 text-white rounded disabled:bg-blue-100"
            onClick={saveData}
          >
            {id ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
