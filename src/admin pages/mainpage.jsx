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
  FaTrophy,
} from "react-icons/fa";

// API Base URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ;

// Axios instance with auth header
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
  return `${d.getFullYear()}/${SINHALA_MONTH[d.getMonth()]}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const sumIncome = (walletData) =>
  Array.isArray(walletData)
    ? walletData
        .filter((w) => w.status === "accepted")
        .reduce((acc, w) => acc + (w.amount || 0), 0)
    : 0;

function FilterCard({ icon: Icon, label, count, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 cursor-pointer flex flex-col items-center justify-center rounded-xl shadow-md p-3 min-w-[100px] transition-all ${
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
    if (status !== order.order_status) {
      onSaveStatus(order, status);
    }
    setEditing(false);
  };

  // Calculate total price if price and quantity available
  const pricePerUnit = order.product_details?.product_main_price || 0;
  const quantity = order.quantity || 0;
  const totalPrice = pricePerUnit * quantity;
  const order_id = order.order_id || "none";

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <div className="font-bold text-lg">
            Order ID: {order._id || order.order_id || order.oder_id || "N/A"}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">User Email:</span> {order.user_email}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Created At:</span> {createdDate}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Product Name:</span>{" "}
            {order.product_details?.product_name || "-"}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Quantity:</span> {quantity}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Price per unit:</span> LKR {pricePerUnit.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Total Price:</span> LKR {totalPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Oder id:</span> {order_id}
          </div>

          {/* Optional fields: shipping address, phone, notes */}
          {order.shipping_address && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Shipping Address:</span> {order.shipping_address}
            </div>
          )}
          {order.phone && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Phone:</span> {order.phone}
            </div>
          )}
          {order.notes && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Notes:</span> {order.notes}
            </div>
          )}
        </div>
        <div className="ml-4 flex flex-col items-end gap-2">
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
      <div>
        <div className="font-semibold text-sm">{bet.user_email}</div>
        <div className="text-xs text-gray-500">{date}</div>
        <div className="text-sm">
          <span className="font-semibold">Product:</span> {bet.product_name || bet.item_name}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Price:</span> {bet.product_price ?? bet.item_main_price ?? "-"}
        </div>
      </div>
    </div>
  );
}

function WinnerCard({ winner }) {
  const date = new Date(winner.date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="bg-yellow-50 border border-yellow-400 rounded-xl shadow p-4 mb-3 flex gap-3">
      <img
        src={winner.product_image || ""}
        alt={winner.product_name}
        className="w-20 h-20 object-cover rounded-lg"
        onError={(e) => (e.currentTarget.src = "")}
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <div className="font-bold">{winner.product_name}</div>
            <div className="text-xs text-gray-600">
              🏆 Winner: {winner.user_name || winner.user_email}
            </div>
            <div className="text-sm mt-1">
              Bet Code: <strong>{winner.bet_code}</strong>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">{date}</div>
        </div>
        <div className="mt-2 text-sm">
          Price: LKR {winner.product_price ?? "-"} | Email: {winner.user_email}
        </div>
      </div>
    </div>
  );
}

export default function DashboardMobilePage() {
  const [activeFilter, setActiveFilter] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [bets, setBets] = useState([]);
  const [users, setUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAllCounts = useCallback(async () => {
    try {
      const [ordersRes, betsRes, usersRes, walletRes, winnersRes] = await Promise.all([
        api.get("api/oder/all"),
        api.get("api/bets/all"),
        api.get("api/user"),
        api.get("api/wallet/all"),
        api.get("api/bets/winner"),
      ]);

      const ordersList = ordersRes.data?.orders || [];
      const betsList = betsRes.data || [];
      const usersList = usersRes.data?.list || [];
      const walletList = walletRes.data?.data || [];
      const winnersList = winnersRes.data?.data || [];

      setOrders(ordersList);
      setBets(betsList);
      setUsers(usersList);
      setWinners(winnersList);

      setCounts({
        users: usersList.length,
        orders: ordersRes.data?.total ?? ordersList.length,
        bets: betsList.length,
        income: sumIncome(walletList),
        winners: winnersRes.data?.meta?.total_returned ?? winnersList.length,
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
      const list = res.data?.orders || [];
      setOrders(list);
      setCounts((c) => ({ ...c, orders: res.data?.total ?? list.length }));
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveStatusFromOrder = async (order, newStatus) => {
    const id =  order._id;
    if (!id) return;
    try {
      await api.put(`api/oder/update/${id}`, {
  order_status: newStatus,
  product_details: {
    product_id: existingOrder.product_details.product_id,
    product_name: existingOrder.product_details.product_name,
    product_coin_balance: existingOrder.product_details.product_coin_balance,
    product_main_balance: updatedMainBalance,  
  },
  user_email: existingOrder.user_email,
  user_name: existingOrder.user_name,
  user_address: {
    phone_number: existingOrder.user_address.phone_number,
    address_line: existingOrder.user_address.address_line,
    name: existingOrder.user_address.name,
    district: existingOrder.user_address.district,
  },
  quantity: existingOrder.quantity,
  order_created_date: existingOrder.order_created_date,
  order_id: existingOrder.order_id,
});
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error(res.data.message);
    }
  };

  const groupedOrders = orders.reduce((acc, o) => {
    const key = formatSinhalaDateGroup(o.order_created_date);
    (acc[key] = acc[key] || []).push(o);
    return acc;
  }, {});

  const groupedBets = bets.reduce((acc, b) => {
    const key = formatSinhalaDateGroup(b.created_at || b.placed_at);
    (acc[key] = acc[key] || []).push(b);
    return acc;
  }, {});

  const groupedWinners = winners.reduce((acc, w) => {
    const key = formatSinhalaDateGroup(w.date);
    (acc[key] = acc[key] || []).push(w);
    return acc;
  }, {});

  useEffect(() => {
    fetchAllCounts();
  }, [fetchAllCounts]);

  useEffect(() => {
    if (activeFilter === "orders") fetchOrders();
  }, [activeFilter, fetchOrders]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Filter */}
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
            count={
              counts.income ? `LKR ${counts.income.toLocaleString()}` : null
            }
            active={activeFilter === "income"}
            onClick={() => setActiveFilter("income")}
          />
          <FilterCard
            icon={FaTrophy}
            label="Winners"
            count={counts.winners}
            active={activeFilter === "winners"}
            onClick={() => setActiveFilter("winners")}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="text-center text-gray-500 mt-6">Loading...</div>
          )}

          {/* Orders */}
         {!loading && activeFilter === "orders" && (
  <>
    {Object.keys(groupedOrders).length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        No orders found.
      </div>
    ) : (
      Object.entries(groupedOrders)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // 🆕 latest first
        .map(([date, items]) => (
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
        ))
    )}
  </>
)}

          {/* Bets */}
          {!loading && activeFilter === "bets" && (
            <>
              {Object.keys(groupedBets).length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No bets found.
                </div>
              ) : (
                Object.entries(groupedBets).map(([date, items]) => (
                  <div key={date} className="mb-6">
                    <div className="text-sm font-semibold mb-2">{date}</div>
                    {items.map((bet) => (
                      <BetCard key={bet.bet_id || bet._id} bet={bet} />
                    ))}
                  </div>
                ))
              )}
            </>
          )}

          {/* Users */}
          {!loading && activeFilter === "users" && (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-lg font-bold">{counts.users ?? 0}</div>
              <div className="text-sm text-gray-600">
                Total users (details private)
              </div>
            </div>
          )}

          {/* Income */}
          {!loading && activeFilter === "income" && (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-lg font-bold">
                Total Income: LKR{" "}
                {counts.income ? counts.income.toLocaleString() : 0}
              </div>
              <div className="text-sm text-gray-600">
                Sum of accepted wallet requests
              </div>
            </div>
          )}

          {/* Winners */}
          {!loading && activeFilter === "winners" && (
            <>
              {Object.keys(groupedWinners).length === 0 ? (
                <div className="text-center text-gray-500">No winners yet.</div>
              ) : (
                Object.entries(groupedWinners).map(([date, items]) => (
                  <div key={date} className="mb-6">
                    <div className="text-sm font-semibold mb-2">{date}</div>
                    {items.map((winner) => (
                      <WinnerCard
                        key={`${winner.product_id}-${winner.user_email}-${winner.date}`}
                        winner={winner}
                      />
                    ))}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
