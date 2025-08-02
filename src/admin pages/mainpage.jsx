import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUsers,
  FaShoppingBag,
  FaDice,
  FaMoneyBillWave,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // e.g. https://winzy-api-server.onrender.com/api

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Sinhala months
const SINHALA_MONTH = {
  0: "ජනවාරි",
  1: "පෙබරවාරි",
  2: "මාර්තු",
  3: "අප්රේල්",
  4: "මැයි",
  5: "ජූනි",
  6: "ජූලි",
  7: "අගෝස්තු",
  8: "සැප්තැම්බර්",
  9: "ඔක්තෝබර්",
  10: "නොවැම්බර්",
  11: "දෙසැම්බර්",
};

const formatSinhalaDateGroup = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return "Unknown";
  const year = d.getFullYear();
  const month = SINHALA_MONTH[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const sumIncome = (walletData) => {
  if (!Array.isArray(walletData)) return 0;
  return walletData
    .filter((w) => w.status === "accepted")
    .reduce((acc, w) => acc + (w.amount || 0), 0);
};

function FilterCard({ icon: Icon, label, count, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 cursor-pointer select-none flex flex-col items-center justify-center rounded-xl shadow-md p-3 min-w-[100px] transition-all ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-800 hover:shadow-lg"
      }`}
    >
      <Icon size={24} className="mb-1" />
      <div className="text-[10px] font-semibold">{label}</div>
      <div className="text-sm font-bold mt-1">{count ?? "..."}</div>
    </div>
  );
}

function OrderCard({ order, onSaveStatus }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(order.order_status);
  const createdDate = new Date(order.order_created_date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const save = () => {
    if (status === order.order_status) {
      setEditing(false);
      return;
    }
    onSaveStatus(order, status);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-bold text-base">{order.user_email}</div>
          <div className="text-xs text-gray-500 mb-1">{createdDate}</div>
          <div className="text-sm">
            <span className="font-semibold">Product:</span>{" "}
            {order.product_details?.product_name || "-"}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Quantity:</span> {order.quantity}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Price:</span>{" "}
            LKR {order.product_details?.product_main_price ?? 0} x {order.quantity}
          </div>
        </div>
        <div className="ml-2 flex flex-col items-end gap-2">
          {editing ? (
            <div className="flex gap-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-sm rounded border px-2 py-1"
              >
                <option value="">Select</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={save} className="text-green-600 ml-1" aria-label="Save">
                <FaSave />
              </button>
              <button
                onClick={() => {
                  setStatus(order.order_status);
                  setEditing(false);
                }}
                className="text-red-600 ml-1"
                aria-label="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-sm capitalize">{order.order_status || "-"}</div>
              <button onClick={() => setEditing(true)} className="text-indigo-600" aria-label="Edit">
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BetCard({ bet }) {
  const date = new Date(bet.created_at || bet.placed_at).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="font-semibold text-sm">{bet.user_email}</div>
          <div className="text-xs text-gray-500">{date}</div>
          <div className="text-sm">
            <span className="font-semibold">Product:</span> {bet.product_name || bet.item_name}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Price:</span>{" "}
            {bet.product_price ?? bet.item_main_price ?? "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardMobilePage() {
  const [activeFilter, setActiveFilter] = useState("orders"); // orders | users | bets | income
  const [orders, setOrders] = useState([]);
  const [bets, setBets] = useState([]);
  const [users, setUsers] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [counts, setCounts] = useState({
    users: null,
    orders: null,
    bets: null,
    income: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchAllCounts = useCallback(async () => {
    try {
      const [ordersRes, betsRes, usersRes, walletRes] = await Promise.all([
        api.get("api/oder/all"),
        api.get("api/bets/all"),
        api.get("api/user"),
        api.get("api/wallet/all"),
      ]);

      const ordersList = Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : [];
      const betsList = Array.isArray(betsRes.data) ? betsRes.data : [];
      const usersList = Array.isArray(usersRes.data?.list) ? usersRes.data.list : [];
      const walletList = Array.isArray(walletRes.data?.data) ? walletRes.data.data : [];

      setOrders(ordersList);
      setBets(betsList);
      setUsers(usersList);
      setWallet(walletList);

      setCounts({
        users: usersList.length,
        orders: ordersRes.data?.total ?? ordersList.length,
        bets: betsList.length,
        income: sumIncome(walletList),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load overview");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("api/oder/all");
      const list = Array.isArray(res.data?.orders) ? res.data.orders : [];
      setOrders(list);
      setCounts((c) => ({ ...c, orders: res.data?.total ?? list.length }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("api/bets/all");
      const list = Array.isArray(res.data) ? res.data : [];
      setBets(list);
      setCounts((c) => ({ ...c, bets: list.length }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bets");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("api/user");
      const list = Array.isArray(res.data?.list) ? res.data.list : [];
      setUsers(list);
      setCounts((c) => ({ ...c, users: list.length }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await api.get("api/wallet/all");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setWallet(list);
      setCounts((c) => ({ ...c, income: sumIncome(list) }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wallet/income");
    }
  }, []);

  useEffect(() => {
    fetchAllCounts();
  }, [fetchAllCounts]);

  useEffect(() => {
    if (activeFilter === "orders") fetchOrders();
    if (activeFilter === "bets") fetchBets();
    if (activeFilter === "users") fetchUsers();
    if (activeFilter === "income") fetchWallet();
  }, [activeFilter, fetchOrders, fetchBets, fetchUsers, fetchWallet]);

  // Save status: picks best identifier (oder_id, order_id, _id)
  const handleSaveStatusFromOrder = async (order, newStatus) => {
    const id = order.oder_id || order.order_id || order._id;
    if (!id) {
      console.warn("No valid order identifier on order:", order);
      return;
    }
    try {
      await api.put(`api/oder/${id}`, { order_status: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error("update order status", err);
      toast.error("Failed to update status");
    }
  };

  // Grouping
  const groupedOrders = orders.reduce((acc, o) => {
    const key = formatSinhalaDateGroup(o.order_created_date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {});

  const groupedBets = bets.reduce((acc, b) => {
    const dt = b.created_at || b.placed_at;
    const key = dt ? formatSinhalaDateGroup(dt) : "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Filter section (20%) */}
        <div className="h-[20%] px-4 py-3 flex items-center overflow-x-auto gap-3 bg-white shadow sticky top-0 z-10">
          <FilterCard
            icon={FaShoppingBag}
            label="Orders"
            count={counts.orders}
            active={activeFilter === "orders"}
            onClick={() => setActiveFilter("orders")}
          />
          <FilterCard
            icon={FaUsers}
            label="Users"
            count={counts.users}
            active={activeFilter === "users"}
            onClick={() => setActiveFilter("users")}
          />
          <FilterCard
            icon={FaDice}
            label="Bets"
            count={counts.bets}
            active={activeFilter === "bets"}
            onClick={() => setActiveFilter("bets")}
          />
          <FilterCard
            icon={FaMoneyBillWave}
            label="Income"
            count={counts.income ? `LKR ${counts.income.toLocaleString()}` : null}
            active={activeFilter === "income"}
            onClick={() => setActiveFilter("income")}
          />
        </div>

        {/* Detail (80%) */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && <div className="text-center text-gray-500 mt-6">Loading...</div>}

          {!loading && activeFilter === "orders" && (
            <>
              {Object.keys(groupedOrders).length === 0 && (
                <div className="text-center text-gray-500 mt-10">No orders found.</div>
              )}
              {Object.entries(groupedOrders).map(([date, items]) => (
                <div key={date} className="mb-6">
                  <div className="text-sm font-semibold mb-2">{date}</div>
                  {items.map((order) => (
                    <OrderCard
                      key={order._id || order.order_id}
                      order={order}
                      onSaveStatus={handleSaveStatusFromOrder}
                    />
                  ))}
                </div>
              ))}
            </>
          )}

          {!loading && activeFilter === "bets" && (
            <>
              {Object.keys(groupedBets).length === 0 && (
                <div className="text-center text-gray-500 mt-10">No bets found.</div>
              )}
              {Object.entries(groupedBets).map(([date, items]) => (
                <div key={date} className="mb-6">
                  <div className="text-sm font-semibold mb-2">{date}</div>
                  {items.map((bet) => (
                    <BetCard key={bet.bet_id || bet._id} bet={bet} />
                  ))}
                </div>
              ))}
            </>
          )}

          {!loading && activeFilter === "users" && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-center">
                <div className="text-lg font-bold">{counts.users ?? 0}</div>
                <div className="text-sm text-gray-600">Total users (details private)</div>
              </div>
            </div>
          )}

          {!loading && activeFilter === "income" && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-center">
                <div className="text-lg font-bold">
                  Total Income: LKR {counts.income ? counts.income.toLocaleString() : 0}
                </div>
                <div className="text-sm text-gray-600">Sum of accepted wallet requests</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
