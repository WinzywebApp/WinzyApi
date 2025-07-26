import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    task_description: "",
    point_balance: 0,
    link: "",
    type: "daily task",
    icon: "tiktok",
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
   
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.type === "admin");
    } catch {
      setIsAdmin(false);
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!isAdmin) return; // prevent fetching if not admin
    try {
      const res = await axios.get(`${API_BASE}/api/task/all`, axiosConfig);
      // API returns { success: true, tasks: [...] }
      if (res.data.success) {
        setTasks(res.data.tasks);
      } else {
        toast.error("❌ Failed to load tasks");
      }
    } catch (err) {
      toast.error("❌ Failed to load tasks");
    }
  };

  const handleDelete = async (task_id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_BASE}/api/task/${task_id}`, axiosConfig);
      toast.success("🗑️ Task deleted");
      await fetchTasks();
    } catch (err) {
      toast.error("❌ Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    try {
      const { task_id, point_balance, link, task_description, type, icon } = editingTask;
      await axios.put(
        `${API_BASE}/api/task/${task_id}`,
        { task_id, point_balance, link, task_description, type, icon },
        axiosConfig
      );
      toast.success("✅ Task updated");
      setShowEditForm(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      toast.error("❌ Failed to update task");
    }
  };

  const handleAdd = async () => {
    try {
      const { point_balance, link, task_description, type, icon } = newTask;
      const res = await axios.post(
        `${API_BASE}/api/task/creat`,
        { point_balance, link, task_description, type, icon },
        axiosConfig
      );
      toast.success(res.data.message || "Task created!");
      setShowAddForm(false);
      setNewTask({
        task_description: "",
        point_balance: 0,
        link: "",
        type: "daily task",
        icon: "tiktok",
      });
      await fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 max-w-3xl mx-auto text-center text-red-600 font-bold">
        🚫 You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">📋 Task Manager</h2>

      {/* Tasks List */}
      <div className="grid gap-4 mb-8">
        {tasks.map((task) => (
          <div key={task.task_id} className="bg-white rounded-xl shadow p-4 relative">
            <button
              onClick={() => handleEditClick(task)}
              className="absolute top-2 right-10 bg-white rounded-full p-1 shadow cursor-pointer"
              title="Edit Task"
            >
              <FaPen className="text-green-600" />
            </button>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              onClick={() => handleDelete(task.task_id)}
              title="Delete Task"
            >
              <FaTrash />
            </button>
            <h4 className="font-bold text-emerald-800">{task.task_description}</h4>
            <p className="text-sm text-gray-600 mb-1">Link: <a href={task.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">{task.link}</a></p>
            <p className="text-sm text-gray-600 mb-1">Type: {task.type}</p>
            <p className="text-sm text-gray-600 mb-1">Icon: {task.icon}</p>
            <div className="text-sm text-gray-500">🎁 Reward: {task.point_balance} coins</div>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg"
        title="Add New Task"
      >
        <FaPlus />
      </button>

      {/* Edit Task Modal */}
      {showEditForm && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md overflow-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

            <label className="block mb-1 font-medium">Task Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={editingTask.task_description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, task_description: e.target.value })
              }
            />

            <label className="block mb-1 font-medium">Link</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={editingTask.link}
              onChange={(e) => setEditingTask({ ...editingTask, link: e.target.value })}
            />

            <label className="block mb-1 font-medium">Type</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={editingTask.type}
              onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value })}
            >
              <option value="daily task">Daily Task</option>
              <option value="new user task">New User Task</option>
            </select>

            <label className="block mb-1 font-medium">Icon</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mb-6"
              value={editingTask.icon}
              onChange={(e) => setEditingTask({ ...editingTask, icon: e.target.value })}
            >
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="telegram">Telegram</option>
              <option value="youtube">YouTube</option>
            </select>

            <label className="block mb-1 font-medium">Coin Reward</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 mb-6"
              value={editingTask.point_balance}
              onChange={(e) =>
                setEditingTask({ ...editingTask, point_balance: Number(e.target.value) })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingTask(null);
                }}
                className="btn btn-outline px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md overflow-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>

            <label className="block mb-1 font-medium">Task Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={newTask.task_description}
              onChange={(e) =>
                setNewTask({ ...newTask, task_description: e.target.value })
              }
            />

            <label className="block mb-1 font-medium">Link</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={newTask.link}
              onChange={(e) => setNewTask({ ...newTask, link: e.target.value })}
            />

            <label className="block mb-1 font-medium">Type</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            >
              <option value="daily task">Daily Task</option>
              <option value="new user task">New User Task</option>
            </select>

            <label className="block mb-1 font-medium">Icon</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mb-6"
              value={newTask.icon}
              onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
            >
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="telegram">Telegram</option>
              <option value="youtube">YouTube</option>
            </select>

            <label className="block mb-1 font-medium">Coin Reward</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 mb-6"
              value={newTask.point_balance}
              onChange={(e) =>
                setNewTask({ ...newTask, point_balance: Number(e.target.value) })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTask({
                    task_description: "",
                    point_balance: 0,
                    link: "",
                    type: "daily task",
                    icon: "tiktok",
                  });
                }}
                className="btn btn-outline px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
