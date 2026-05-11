export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cafeteria Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Orders</p>
          <h2 className="text-xl font-bold">120</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Revenue</p>
          <h2 className="text-xl font-bold">₹25,000</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Items</p>
          <h2 className="text-xl font-bold">45</h2>
        </div>
      </div>
    </div>
  );
}