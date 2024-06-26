"use client";
import React, { FormEventHandler, useEffect, useState } from "react";
import instance from "../../axois/instance";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "@/store/slices/userSlice";
import jwt from "jsonwebtoken";

// Define Task type
interface Task {
  completed: boolean;
  dueDate: Date;
  _id: string;
  title: string;
  description: string;
  category: string;
}

const TaskList = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.verify(token, "this-my-secret");
        dispatch(setUserData(decodedToken));
      } catch (error) {
        console.error("Error verifying token:", error);
        // Handle invalid token or verification errors here
      }
    } else {
      console.error("Token not found in localStorage");
      // Handle case where token is not found
    }

    fetchTasksFromServer();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      // Manually add the userId to the form data
      const formDataWithUserId = {
        ...formData,
        userId: userData.id, // Replace this with the actual userId
      };

      await instance.post("/task", formDataWithUserId);
      // After successful submission, clear the form data
      setFormData({
        title: "",
        description: "",
        category: "",
        dueDate: "",
      });

      // Fetch the tasks again to refresh the task list
      fetchTasksFromServer();
    } catch (error) {
      console.error("Error adding task:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const fetchTasksFromServer = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await instance.get<Task[]>(`/task/user/${userData.id}`);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching tasks. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    setLoading(true);
    try {
      await instance.delete(`/task/${taskId}`);
      fetchTasksFromServer();
    } catch (error) {
      setError("Error deleting task. Please try again.");
      setLoading(false);
    }
  };

  const handleUpdate = async (taskId: string) => {
    setLoading(true);
    try {
      await instance.patch(`/task/${taskId}`, editFormData);
      setEditingTaskId(null);
      fetchTasksFromServer();
    } catch (error) {
      setError("Error updating task. Please try again.");
      setLoading(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      category: task.category,
    });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const uniqueCategories = Array.from(
    new Set(tasks.map((task) => task.category))
  );
  const uniqueCategoriesWithAll = ["All", ...uniqueCategories];

  const tasksByCategory: { [key: string]: Task[] } = {};
  tasks.forEach((task) => {
    if (!tasksByCategory[task.category]) {
      tasksByCategory[task.category] = [];
    }
    tasksByCategory[task.category].push(task);
  });

  const calculateDaysDifference = (dueDate: Date) => {
    const dueDateTime = new Date(dueDate).getTime();
    const currentTime = new Date().getTime();
    const differenceInMilliseconds = dueDateTime - currentTime;
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  };

  const handleToggleCompleted = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container  mb-10">
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <Label className="text-base mt-10" htmlFor="new-task">
          New Task
        </Label>
        <div className="border-2 border-dark rounded p-5">
          <div className="mt-1">
            <Label className="text-sm" htmlFor="task-title">
              Task Title
            </Label>
            <Input
              className=""
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your new task title"
              type="text"
            />
          </div>
          <div className="mt-1">
            <Label className="text-sm" htmlFor="task-description">
              Task Description
            </Label>
            <Input
              className=""
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter your new task description"
              type="text"
            />
          </div>
          <div className="mt-1">
            <Label className="text-sm" htmlFor="task-category">
              Task category
            </Label>
            <Input
              className=""
              id="task-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter your new task category"
              type="text"
            />
          </div>
          <div className="mt-1">
            <Label className="text-sm" htmlFor="due-date">
              Due Date
            </Label>
            <Input
              className=""
              id="due-date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              placeholder="Enter your new task description"
              type="date"
            />
          </div>
        </div>
        <div className="flex justify-center my-5">
          <Button size="lg" className="px-24" type="submit">
            Add Task
          </Button>
        </div>
      </form>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:gap-4 md:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Task Categories</CardTitle>
            <CardDescription>
              Categorize your tasks for better organization.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-2 md:mt-0">Filter by Category</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div>
                {uniqueCategoriesWithAll.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedCategory === "All" || selectedCategory === null
                ? tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex flex-col p-4 rounded-lg bg-gray-100/40 dark:bg-gray-800/40"
                      onDoubleClick={() => handleToggleCompleted(task._id)}
                    >
                      {/* Task Details */}
                      <div className="flex flex-col flex-1 font-medium mb-4">
                        {editingTaskId === task._id ? (
                          // Edit mode
                          <>
                            <input
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditFormChange}
                              className={`text-xl text-blue-500 mb-2 ${
                                task.completed ? "line-through" : ""
                              }`}
                            />
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              className={`h-24 ${
                                task.completed ? "line-through" : ""
                              }`} // Apply strike-through style if completed
                            ></textarea>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <div
                              className={`text-xl text-blue-500 mb-2 ${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </div>
                            <div
                              className={`${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.description}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {editingTaskId === task._id ? (
                        // Edit mode buttons
                        <div className="flex justify-between">
                          <Button
                            className="px-4 bg-green-500"
                            onClick={() => handleUpdate(task._id)}
                          >
                            Save
                          </Button>
                          <Button
                            className="px-4 bg-gray-500"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        // Display mode buttons
                        <div className="flex justify-between">
                          <Button
                            className="px-4 bg-yellow-500"
                            onClick={() => handleEditClick(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="px-4 bg-red-500"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                        {calculateDaysDifference(task.dueDate) > 0
                          ? `Due in ${calculateDaysDifference(
                              task.dueDate
                            )} days`
                          : calculateDaysDifference(task.dueDate) === 0
                          ? "Due today"
                          : `Overdue by ${Math.abs(
                              calculateDaysDifference(task.dueDate)
                            )} days`}
                      </div>
                    </div>
                  ))
                : tasksByCategory[selectedCategory]?.map((task) => (
                    <div
                      key={task._id}
                      className="flex flex-col p-4 rounded-lg bg-gray-100/40 dark:bg-gray-800/40"
                      onDoubleClick={() => handleToggleCompleted(task._id)}
                    >
                      {/* Task Details */}
                      <div className="flex flex-col flex-1 font-medium mb-4">
                        {editingTaskId === task._id ? (
                          // Edit mode
                          <>
                            <input
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditFormChange}
                              className={`text-xl text-blue-500 mb-2 ${
                                task.completed ? "line-through" : ""
                              }`}
                            />
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              className={`h-24 ${
                                task.completed ? "line-through" : ""
                              }`} // Apply strike-through style if completed
                            ></textarea>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <div
                              className={`text-xl text-blue-500 mb-2 ${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </div>
                            <div
                              className={`${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.description}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {editingTaskId === task._id ? (
                        // Edit mode buttons
                        <div className="flex justify-between">
                          <Button
                            className="px-4 bg-green-500"
                            onClick={() => handleUpdate(task._id)}
                          >
                            Save
                          </Button>
                          <Button
                            className="px-4 bg-gray-500"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        // Display mode buttons
                        <div className="flex justify-between">
                          <Button
                            className="px-4 bg-yellow-500"
                            onClick={() => handleEditClick(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="px-4 bg-red-500"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                        {calculateDaysDifference(task.dueDate) > 0
                          ? `Due in ${calculateDaysDifference(
                              task.dueDate
                            )} days`
                          : calculateDaysDifference(task.dueDate) === 0
                          ? "Due today"
                          : `Overdue by ${Math.abs(
                              calculateDaysDifference(task.dueDate)
                            )} days`}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;
