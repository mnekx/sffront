import React, { useState } from "react";

// Define FoodType for type safety
type FoodType = "Maize" | "Beans" | "Rice";

// Sample food types and sources for dropdowns
const FOOD_TYPES: FoodType[] = ["Maize", "Beans", "Rice"];
const SOURCES = ["Parents", "Govt", "Harvest"];
const PURPOSES = ["Lunch", "Transfer"];

const MOCK_BALANCES: Record<FoodType, number> = {
  Maize: 1050,
  Beans: 620,
  Rice: 120,
};

export function FoodEntryForm() {
  const [movementType, setMovementType] = useState<"incoming" | "outgoing">("incoming");
  const [rows, setRows] = useState([
    { foodType: "", quantity: "", source: "", purpose: "", notes: "" },
  ]);
  const [errors, setErrors] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Helper for real-time predicted balance
  function predictedBalance(type: FoodType): number {
    let sum = Number(MOCK_BALANCES[type] || 0);
    rows.forEach(row => {
      if (row.foodType === type && row.quantity) {
        const qty = Number(row.quantity);
        sum += movementType === "incoming" ? qty : -qty;
      }
    });
    return sum;
  }

  // Validation
  function validate() {
    let errs = rows.map((row) => {
      let e: any = {};
      if (!row.foodType) e.foodType = "Required";
      if (!row.quantity || Number(row.quantity) <= 0) e.quantity = "Positive number required";
      if (movementType === "incoming" && !row.source) e.source = "Required";
      if (movementType === "outgoing" && !row.purpose) e.purpose = "Required";
      return e;
    });
    setErrors(errs);
    return errs.every((row) => Object.keys(row).length === 0);
  }

  function handleRowChange(idx: number, key: string, val: string) {
    setRows(r =>
      r.map((row, i) => (i === idx ? { ...row, [key]: val } : row))
    );
  }

  function addRow() {
    setRows([...rows, { foodType: "", quantity: "", source: "", purpose: "", notes: "" }]);
    setErrors([...errors, {}]);
  }

  function removeRow(idx: number) {
    setRows(rows.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(false);
    if (validate()) {
      setSubmitted(true);
      // TODO: send to backend!
      setTimeout(() => setSubmitted(false), 2000);
    }
  }

  function handleReset() {
    setRows([{ foodType: "", quantity: "", source: "", purpose: "", notes: "" }]);
    setErrors([]);
    setSubmitted(false);
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Food Movement Entry</h2>
          <p className="text-gray-600 text-sm">Enter today's incoming or outgoing food for your school.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl font-bold ${movementType === "incoming" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMovementType("incoming")}
          >
            Incoming
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-xl font-bold ${movementType === "outgoing" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMovementType("outgoing")}
          >
            Outgoing
          </button>
        </div>
      </div>

      <form className="bg-white rounded-2xl shadow p-4 mb-8" onSubmit={handleSubmit} autoComplete="off">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Food Type<span className="text-red-500">*</span></th>
                <th className="px-3 py-2">Quantity (kg)<span className="text-red-500">*</span></th>
                <th className="px-3 py-2">
                  {movementType === "incoming" ? "Source" : "Purpose"}
                  <span className="text-red-500">*</span>
                </th>
                <th className="px-3 py-2">Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">
                    <select
                      className={`border rounded-lg px-2 py-1 w-32 ${errors[idx]?.foodType && "border-red-500"}`}
                      value={row.foodType}
                      onChange={e => handleRowChange(idx, "foodType", e.target.value)}
                    >
                      <option value="">Select...</option>
                      {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={1}
                      className={`border rounded-lg px-2 py-1 w-24 ${errors[idx]?.quantity && "border-red-500"}`}
                      placeholder="e.g. 100"
                      value={row.quantity}
                      onChange={e => handleRowChange(idx, "quantity", e.target.value)}
                    />
                    {errors[idx]?.quantity && <div className="text-xs text-red-500">{errors[idx].quantity}</div>}
                  </td>
                  <td className="px-2 py-1">
                    {movementType === "incoming" ? (
                      <select
                        className={`border rounded-lg px-2 py-1 w-28 ${errors[idx]?.source && "border-red-500"}`}
                        value={row.source}
                        onChange={e => handleRowChange(idx, "source", e.target.value)}
                      >
                        <option value="">Source...</option>
                        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <select
                        className={`border rounded-lg px-2 py-1 w-28 ${errors[idx]?.purpose && "border-red-500"}`}
                        value={row.purpose}
                        onChange={e => handleRowChange(idx, "purpose", e.target.value)}
                      >
                        <option value="">Purpose...</option>
                        {PURPOSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      className="border rounded-lg px-2 py-1 w-40"
                      value={row.notes}
                      placeholder="(optional)"
                      onChange={e => handleRowChange(idx, "notes", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    {rows.length > 1 && (
                      <button type="button" className="text-red-600 px-2" onClick={() => removeRow(idx)}>
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="px-3 py-1 mb-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" onClick={addRow}>
          + Add Another Food Item
        </button>
        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700" disabled={submitted}>
            {submitted ? "Submitted!" : "✅ Submit"}
          </button>
          <button type="button" className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-400" onClick={handleReset}>
            🔄 Reset All
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">📊 Food Balance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Food Type</th>
                <th className="px-4 py-2">Current Stock (kg)</th>
                <th className="px-4 py-2">Predicted After Entry (kg)</th>
              </tr>
            </thead>
            <tbody>
              {FOOD_TYPES.map(type => (
                <tr key={type}>
                  <td className="px-4 py-2">{type}</td>
                  <td className="px-4 py-2">{MOCK_BALANCES[type]}</td>
                  <td className="px-4 py-2">{predictedBalance(type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FoodEntryForm;