import { useState } from "react";

export function FoodEntryForm() {
  const [type, setType] = useState("incoming");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📦 Record Food Movement</h1>
        <p className="text-sm text-gray-500">Fill in all required fields for today's food movement.</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded-xl text-white ${type === "incoming" ? "bg-green-600" : "bg-gray-400"}`}
            onClick={() => setType("incoming")}
          >Incoming</button>
          <button
            className={`px-4 py-2 rounded-xl text-white ${type === "outgoing" ? "bg-red-600" : "bg-gray-400"}`}
            onClick={() => setType("outgoing")}
          >Outgoing</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Food Type</label>
            <select className="w-full border rounded-xl px-3 py-2">
              <option>Maize</option>
              <option>Beans</option>
              <option>Rice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Quantity (kg)</label>
            <input type="number" className="w-full border rounded-xl px-3 py-2" />
          </div>

          {type === "incoming" && (
            <div>
              <label className="block text-sm text-gray-600">Source</label>
              <select className="w-full border rounded-xl px-3 py-2">
                <option>Parents</option>
                <option>Govt</option>
                <option>Harvest</option>
              </select>
            </div>
          )}

          {type === "outgoing" && (
            <div>
              <label className="block text-sm text-gray-600">Purpose</label>
              <select className="w-full border rounded-xl px-3 py-2">
                <option>Lunch</option>
                <option>Transfer</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Notes</label>
            <textarea className="w-full border rounded-xl px-3 py-2"></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button className="bg-gray-400 px-4 py-2 rounded-xl text-white">Reset</button>
          <button className="bg-blue-600 px-4 py-2 rounded-xl text-white">Submit</button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">📊 Food Balance Summary</h2>
        <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Food Type</th>
              <th className="px-4 py-2">In Stock (kg)</th>
              <th className="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Maize</td>
              <td className="px-4 py-2">1,050</td>
              <td className="px-4 py-2">13-Jun-2025 09:00AM</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2">Beans</td>
              <td className="px-4 py-2">620</td>
              <td className="px-4 py-2">12-Jun-2025 05:00PM</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Rice</td>
              <td className="px-4 py-2">120</td>
              <td className="px-4 py-2">10-Jun-2025 11:00AM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FoodEntryForm;
