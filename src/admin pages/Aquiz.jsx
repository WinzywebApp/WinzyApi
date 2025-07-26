import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // New quiz form state
  const [newQuiz, setNewQuiz] = useState({
    category: "",
    emoji_clue: "",
    correct_answer: "",
    hint: "",
  });

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/question/emoji-question/all`, axiosConfig);
      setQuizzes(res.data.data || []);
    } catch (err) {
      toast.error("❌ Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  // Delete quiz question by _id
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`${API_URL}/api/question/emoji-question/${id}`, axiosConfig);
      toast.success("🗑️ Quiz deleted");
      fetchQuizzes();
    } catch (err) {
      toast.error("❌ Failed to delete quiz");
    }
  };

  // Start editing quiz
  const handleEdit = (quiz) => {
    setEditingQuiz({ ...quiz });
    setShowEditForm(true);
  };

  // Update quiz question by _id
  const handleUpdate = async () => {
    if (
      !editingQuiz.category ||
      !editingQuiz.emoji_clue ||
      !editingQuiz.correct_answer
    ) {
      toast.error("❗ Fill all required fields");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/api/question/emoji-question/${editingQuiz._id}`,
        {
          category: editingQuiz.category,
          emoji_clue: editingQuiz.emoji_clue,
          correct_answer: editingQuiz.correct_answer,
          hint: editingQuiz.hint,
        },
        axiosConfig
      );
      toast.success("✅ Quiz updated");
      setShowEditForm(false);
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      toast.error("❌ Failed to update quiz");
    }
  };

  // Add new quiz question
  const handleAdd = async () => {
    const { category, emoji_clue, correct_answer } = newQuiz;
    if (!category || !emoji_clue || !correct_answer) {
      toast.error("❗ Fill all required fields");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/question/emoji-question/create`, newQuiz, axiosConfig);
      toast.success("🎉 Quiz created!");
      setShowAddForm(false);
      setNewQuiz({ category: "", emoji_clue: "", correct_answer: "", hint: "" });
      fetchQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to add quiz");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-center">🎲 Emoji Quiz Manager</h1>

      {loading && <p className="text-center mb-4">Loading quizzes...</p>}

      {/* Quiz Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-cyan-100 border border-blue-500 rounded-2xl p-5 relative shadow"
          >
            <button
              onClick={() => handleEdit(quiz)}
              className="absolute top-3 right-12 bg-white rounded-full p-1 shadow hover:bg-blue-100 transition"
              title="Edit Quiz"
            >
              <FaPen className="text-blue-500 text-lg" />
            </button>
            <button
              onClick={() => handleDelete(quiz._id)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              title="Delete Quiz"
            >
              <FaTrash className="text-lg" />
            </button>

            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">ID:</span> {quiz.question_id}
            </p>

            <p className="text-lg font-bold mb-1">
              <span className="font-semibold">Emoji Clue:</span> {quiz.emoji_clue}
            </p>

            <p className="mb-1">
              <span className="font-semibold">Category:</span> {quiz.category}
            </p>

            <p className="mb-1">
              <span className="font-semibold">Correct Answer:</span> {quiz.correct_answer}
            </p>

            {quiz.hint && (
              <p className="italic text-gray-600 mt-2">
                <span className="font-semibold">Hint:</span> {quiz.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add New Quiz Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        title="Add New Quiz"
      >
        <FaPlus className="text-xl" />
      </button>

      {/* Edit Quiz Modal */}
      {showEditForm && editingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">✏️ Edit Quiz</h2>

            <label className="block mb-2 font-semibold">Emoji Clue *</label>
            <input
              type="text"
              value={editingQuiz.emoji_clue}
              onChange={(e) =>
                setEditingQuiz({ ...editingQuiz, emoji_clue: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Category *</label>
            <select
              value={editingQuiz.category}
              onChange={(e) =>
                setEditingQuiz({ ...editingQuiz, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="">Select Category</option>
              {[
                "food",
                "country",
                "vehicle",
                "animal",
                "object",
                "place",
                "other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Correct Answer *</label>
            <input
              type="text"
              value={editingQuiz.correct_answer}
              onChange={(e) =>
                setEditingQuiz({ ...editingQuiz, correct_answer: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Hint (optional)</label>
            <input
              type="text"
              value={editingQuiz.hint || ""}
              onChange={(e) =>
                setEditingQuiz({ ...editingQuiz, hint: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingQuiz(null);
                }}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Quiz Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">➕ Add New Quiz</h2>

            <label className="block mb-2 font-semibold">Emoji Clue *</label>
            <input
              type="text"
              value={newQuiz.emoji_clue}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, emoji_clue: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Category *</label>
            <select
              value={newQuiz.category}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="">Select Category</option>
              {[
                "food",
                "country",
                "vehicle",
                "animal",
                "object",
                "place",
                "other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Correct Answer *</label>
            <input
              type="text"
              value={newQuiz.correct_answer}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, correct_answer: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Hint (optional)</label>
            <input
              type="text"
              value={newQuiz.hint || ""}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, hint: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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

export default QuizManager;
