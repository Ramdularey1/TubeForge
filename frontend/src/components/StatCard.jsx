export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-lg sm:text-xl font-bold mt-1">{value}</h2>
    </div>
  );
}