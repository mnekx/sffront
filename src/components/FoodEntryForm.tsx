import React, { useState } from "react";

const FOOD_TYPES = ["Maize", "Beans", "Rice"];
const SOURCES = ["Parents", "Govt", "Harvest"];
const PURPOSES = ["Lunch", "Transfer"];

const MOCK_BALANCES = {
  Maize: 1050,
  Beans: 620,
  Rice: 120,
};

export default function FoodEntryForm() {
  const [movementType, setMovementType] = useState<"incoming" | "outgoing">("incoming");
  const [rows, setRows] = useState([
    { foodType: "", quantity: "", source: "", purpose: "", notes: "" },
  ]);
  const [errors, setErrors] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function predictedBalance(type: string): number {
    let sum = Number(MOCK_BALANCES[type as keyof typeof MOCK_BALANCES] || 0);
    rows.forEach(row => {
      if (row.foodType === type && row.quantity) {
        const qty = Number(row.quantity);
        sum += movementType === "incoming" ? qty : -qty;
      }
    });
    return sum;
  }

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
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Food Movement Entry</h2>
          <p className="text-gray-600 text-sm md:text-base">Enter today's incoming or outgoing food for your school.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-bold transition-colors duration-150 ${
              movementType === "incoming" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMovementType("incoming")}
          >
            Incoming
          </button>
          <button
            type="button"
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-bold transition-colors duration-150 ${
              movementType === "outgoing" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMovementType("outgoing")}
          >
            Outgoing
          </button>
        </div>
      </div>

      <form
        className="bg-white rounded-2xl shadow p-2 sm:p-4 mb-8"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[480px] md:min-w-full text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-3 py-2 whitespace-nowrap">
                  Food Type<span className="text-red-500">*</span>
                </th>
                <th className="px-2 sm:px-3 py-2 whitespace-nowrap">
                  Quantity (kg)<span className="text-red-500">*</span>
                </th>
                <th className="px-2 sm:px-3 py-2 whitespace-nowrap">
                  {movementType === "incoming" ? "Source" : "Purpose"}
                  <span className="text-red-500">*</span>
                </th>
                <th className="px-2 sm:px-3 py-2 whitespace-nowrap">Notes</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-1 sm:px-2 py-1">
                    <select
                      className={`border rounded-lg px-2 py-1 w-full md:w-32 ${
                        errors[idx]?.foodType && "border-red-500"
                      }`}
                      value={row.foodType}
                      onChange={e => handleRowChange(idx, "foodType", e.target.value)}
                    >
                      <option value="">Select...</option>
                      {FOOD_TYPES.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 sm:px-2 py-1">
                    <input
                      type="number"
                      min={1}
                      className={`border rounded-lg px-2 py-1 w-full md:w-24 ${
                        errors[idx]?.quantity && "border-red-500"
                      }`}
                      placeholder="e.g. 100"
                      value={row.quantity}
                      onChange={e => handleRowChange(idx, "quantity", e.target.value)}
                    />
                    {errors[idx]?.quantity && (
                      <div className="text-xs text-red-500">{errors[idx].quantity}</div>
                    )}
                  </td>
                  <td className="px-1 sm:px-2 py-1">
                    {movementType === "incoming" ? (
                      <select
                        className={`border rounded-lg px-2 py-1 w-full md:w-28 ${
                          errors[idx]?.source && "border-red-500"
                        }`}
                        value={row.source}
                        onChange={e => handleRowChange(idx, "source", e.target.value)}
                      >
                        <option value="">Source...</option>
                        {SOURCES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className={`border rounded-lg px-2 py-1 w-full md:w-28 ${
                          errors[idx]?.purpose && "border-red-500"
                        }`}
                        value={row.purpose}
                        onChange={e => handleRowChange(idx, "purpose", e.target.value)}
                      >
                        <option value="">Purpose...</option>
                        {PURPOSES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-1 sm:px-2 py-1">
                    <input
                      type="text"
                      className="border rounded-lg px-2 py-1 w-full md:w-40"
                      value={row.notes}
                      placeholder="(optional)"
                      onChange={e => handleRowChange(idx, "notes", e.target.value)}
                    />
                  </td>
                  <td className="px-1 sm:px-2 py-1 text-center">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 px-2"
                        onClick={() => removeRow(idx)}
                        aria-label="Remove row"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="px-3 py-1 mb-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          onClick={addRow}
        >
          + Add Another Food Item
        </button>
        {/* On md+ screens, show action buttons inline */}
        <div className="hidden sm:flex flex-row gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 w-full sm:w-auto"
            disabled={submitted}
          >
            {submitted ? "Submitted!" : "✅ Submit"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-400 w-full sm:w-auto"
            onClick={handleReset}
          >
            🔄 Reset All
          </button>
        </div>
      </form>

      {/* Sticky mobile action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full z-20 bg-white border-t flex gap-2 px-4 py-3 shadow-lg">
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl flex-1"
          onClick={handleSubmit}
          disabled={submitted}
        >
          {submitted ? "Submitted!" : "✅ Submit"}
        </button>
        <button
          type="button"
          className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 flex-1"
          onClick={handleReset}
        >
          🔄 Reset
        </button>
      </div>

      <div className="mt-8 pb-24 sm:pb-0">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">📊 Food Balance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[340px] md:min-w-full bg-white shadow rounded-xl overflow-hidden text-sm">
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
                  <td className="px-4 py-2">{MOCK_BALANCES[type as keyof typeof MOCK_BALANCES]}</td>
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
