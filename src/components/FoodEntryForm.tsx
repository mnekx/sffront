import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { foodRecords as initialFoodRecords } from "../data/foodRecords";
import {
	Wheat,
	Soup,
	Leaf,
	ArrowDownLeft,
	ArrowUpRight,
	PlusCircle,
	MinusCircle,
	StickyNote,
	UserCheck,
	Undo2,
	CheckCircle,
	RotateCcw,
} from "lucide-react";

const FOOD_TYPES = ["Maize", "Beans", "Rice"];
const SOURCES = ["Parents", "Govt", "Harvest"];
const PURPOSES = ["Lunch", "Transfer"];

// Utility for color badges
function getBadgeColor(type: string) {
	if (type === "Maize")
		return "bg-yellow-100 text-yellow-800 border-yellow-400";
	if (type === "Beans") return "bg-green-100 text-green-800 border-green-400";
	if (type === "Rice") return "bg-blue-100 text-blue-800 border-blue-400";
	return "bg-gray-100 text-gray-800 border-gray-300";
}

function getBadgeIcon(type: string) {
	if (type === "Maize") return <Wheat className="w-4 h-4 mr-2 inline" />;
	if (type === "Beans") return <Soup className="w-4 h-4 mr-2 inline" />;
	if (type === "Rice") return <Leaf className="w-4 h-4 mr-2 inline" />;
	return null;
}

const LOCAL_STORAGE_KEY = "food_records_db";
function getInitialRecords() {
	const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (raw) return JSON.parse(raw);
	return initialFoodRecords;
}

export default function FoodEntryForm() {
	const [movementType, setMovementType] = useState<"incoming" | "outgoing">(
		"incoming"
	);
	const [rows, setRows] = useState([
		{ foodType: "", quantity: "", source: "", purpose: "", notes: "" },
	]);
	const [errors, setErrors] = useState<any[]>([]);
	const [submitted, setSubmitted] = useState(false);

	// Transactions "DB"
	const [foodRecords, setFoodRecords] = useState(getInitialRecords());
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foodRecords));
	}, [foodRecords]);

	// Animations
	const [changedTypes, setChangedTypes] = useState<string[]>([]);
	const [filterType, setFilterType] = useState<string>("All");
	const [filterDate, setFilterDate] = useState<string>("");

	// Current stock for summary badges
	function getCurrentBalance(type: string) {
		let sum = 0;
		foodRecords.forEach(
			(rec: { foodType: string; movementType: string; quantity: number }) => {
				if (rec.foodType === type) {
					sum += rec.movementType === "incoming" ? rec.quantity : -rec.quantity;
				}
			}
		);
		return sum;
	}

	function validate() {
		let errs = rows.map((row) => {
			let e: any = {};
			if (!row.foodType) e.foodType = "Required";
			if (!row.quantity || Number(row.quantity) <= 0)
				e.quantity = "Positive number required";
			if (movementType === "incoming" && !row.source) e.source = "Required";
			if (movementType === "outgoing" && !row.purpose) e.purpose = "Required";
			return e;
		});
		setErrors(errs);
		return errs.every((row) => Object.keys(row).length === 0);
	}

	function handleRowChange(idx: number, key: string, val: string) {
		setRows((r) =>
			r.map((row, i) => (i === idx ? { ...row, [key]: val } : row))
		);
	}

	function addRow() {
		setRows([
			...rows,
			{ foodType: "", quantity: "", source: "", purpose: "", notes: "" },
		]);
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
			const newRecords = rows.map((row) => ({
				date: new Date().toISOString().slice(0, 10),
				foodType: row.foodType,
				quantity: Number(row.quantity),
				movementType,
				source: movementType === "incoming" ? row.source : "",
				purpose: movementType === "outgoing" ? row.purpose : "",
				notes: row.notes,
			}));
			setFoodRecords((prev: any) => [...prev, ...newRecords]);
			setChangedTypes(rows.map((r) => r.foodType));
			setTimeout(() => setSubmitted(false), 1800);
			setTimeout(() => setChangedTypes([]), 1100);
			handleReset();
		}
	}

	function handleReset() {
		setRows([
			{ foodType: "", quantity: "", source: "", purpose: "", notes: "" },
		]);
		setErrors([]);
		setSubmitted(false);
	}

	// Filter transactions (optional)
	const filteredRecords = foodRecords
		.filter(
			(rec: { foodType: string }) =>
				filterType === "All" || rec.foodType === filterType
		)
		.filter((rec: { date: string }) => !filterDate || rec.date === filterDate)
		.slice()
		.reverse();

	// Undo (delete) last transaction
	function handleUndo(idx: number) {
		const toDelete = filteredRecords[idx];
		setFoodRecords(
			foodRecords.filter(
				(
					rec: {
						date: any;
						foodType: any;
						quantity: any;
						movementType: any;
						source: any;
						purpose: any;
						notes: any;
					},
					i: number,
					arr: string | any[]
				) =>
					!(
						arr.length - 1 - i === idx &&
						rec.date === toDelete.date &&
						rec.foodType === toDelete.foodType &&
						rec.quantity === toDelete.quantity &&
						rec.movementType === toDelete.movementType &&
						rec.source === toDelete.source &&
						rec.purpose === toDelete.purpose &&
						rec.notes === toDelete.notes
					)
			)
		);
		setChangedTypes([toDelete.foodType]);
		setTimeout(() => setChangedTypes([]), 1100);
	}

	return (
		<div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
			{/* --- Food Summary Badges --- */}
			<div className="mb-6 flex flex-wrap gap-2">
				{FOOD_TYPES.map((type) => (
					<motion.div
						key={type}
						layout
						animate={
							changedTypes.includes(type)
								? { scale: 1.09, backgroundColor: "#fde68a" }
								: { scale: 1, backgroundColor: "#fff" }
						}
						transition={{ type: "spring", stiffness: 350, damping: 22 }}
						className={`inline-flex items-center px-5 py-2 rounded-full border font-semibold shadow text-base md:text-lg ${getBadgeColor(
							type
						)}`}
						style={{ minWidth: 110, justifyContent: "center" }}
					>
						<span>
							{getBadgeIcon(type)}
							{type}
						</span>
						<span className="ml-2 font-bold">{getCurrentBalance(type)}kg</span>
					</motion.div>
				))}
			</div>

			{/* --- Food Entry Form --- */}
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
						<h2 className="text-xl md:text-2xl font-bold text-gray-800">
							Food Movement Entry
						</h2>
						<p className="text-gray-600 text-sm md:text-base">
							Enter today's incoming or outgoing food for your school.
						</p>
					</div>
					<div className="flex gap-2 sm:gap-3">
						<button
							type="button"
							className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-bold transition-colors duration-150 ${
								movementType === "incoming"
									? "bg-green-600 text-white"
									: "bg-gray-200 text-gray-700"
							}`}
							onClick={() => setMovementType("incoming")}
						>
							<ArrowDownLeft className="inline w-4 h-4 mr-1" />
							Incoming
						</button>
						<button
							type="button"
							className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-bold transition-colors duration-150 ${
								movementType === "outgoing"
									? "bg-red-600 text-white"
									: "bg-gray-200 text-gray-700"
							}`}
							onClick={() => setMovementType("outgoing")}
						>
							<ArrowUpRight className="inline w-4 h-4 mr-1" />
							Outgoing
						</button>
					</div>
				</div>

				<form
					className="bg-white rounded-2xl shadow p-2 sm:p-4 mt-3"
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
												onChange={(e) =>
													handleRowChange(idx, "foodType", e.target.value)
												}
											>
												<option value="">Select...</option>
												{FOOD_TYPES.map((t) => (
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
												onChange={(e) =>
													handleRowChange(idx, "quantity", e.target.value)
												}
											/>
											{errors[idx]?.quantity && (
												<div className="text-xs text-red-500">
													{errors[idx].quantity}
												</div>
											)}
										</td>
										<td className="px-1 sm:px-2 py-1">
											<UserCheck className="inline w-4 h-4 mr-1 text-gray-400" />
											{movementType === "incoming" ? (
												<select
													className={`border rounded-lg px-2 py-1 w-full md:w-28 ${
														errors[idx]?.source && "border-red-500"
													}`}
													value={row.source}
													onChange={(e) =>
														handleRowChange(idx, "source", e.target.value)
													}
												>
													<option value="">Source...</option>
													{SOURCES.map((s) => (
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
													onChange={(e) =>
														handleRowChange(idx, "purpose", e.target.value)
													}
												>
													<option value="">Purpose...</option>
													{PURPOSES.map((s) => (
														<option key={s} value={s}>
															{s}
														</option>
													))}
												</select>
											)}
										</td>
										<td className="px-1 sm:px-2 py-1">
											<StickyNote className="inline w-4 h-4 mr-1 text-yellow-500" />
											<input
												type="text"
												className="border rounded-lg px-2 py-1 w-full md:w-40"
												value={row.notes}
												placeholder="(optional)"
												onChange={(e) =>
													handleRowChange(idx, "notes", e.target.value)
												}
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
													<MinusCircle className="inline w-4 h-4 text-red-600" />
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
						<PlusCircle className="inline w-5 h-5 mr-1" />
						Add Another Food Item
					</button>
					{/* On md+ screens, show action buttons inline */}
					<div className="hidden sm:flex flex-row gap-2 mt-2">
						<button
							type="submit"
							className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 w-full sm:w-auto flex items-center justify-center gap-2"
							disabled={submitted}
						>
							<CheckCircle className="w-5 h-5" />
							{submitted ? "Submitted!" : "Submit"}
						</button>
						<button
							type="button"
							className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-400 w-full sm:w-auto flex items-center justify-center gap-2"
							onClick={handleReset}
						>
							<RotateCcw className="w-5 h-5" />
							Reset
						</button>
					</div>
				</form>
				{/* Sticky mobile action bar */}
				<div className="sm:hidden fixed bottom-0 left-0 w-full z-20 bg-white border-t flex gap-2 px-4 py-3 shadow-lg">
					<button
						type="button"
						className="bg-blue-600 text-white px-6 py-2 rounded-xl flex-1 flex items-center justify-center gap-2"
						onClick={handleSubmit}
						disabled={submitted}
					>
						<CheckCircle className="w-5 h-5" />
						{submitted ? "Submitted!" : "Submit"}
					</button>
					<button
						type="button"
						className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 flex-1 flex items-center justify-center gap-2"
						onClick={handleReset}
					>
						<RotateCcw className="w-5 h-5" />
						Reset
					</button>
				</div>
			</div>

			{/* --- Transaction Records Controls --- */}
			<div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
				<label className="font-semibold text-gray-700 text-sm">
					Filter by Food Type:
					<select
						className="ml-2 border rounded px-2 py-1"
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
						style={{ cursor: "pointer" }}
					>
						<option value="All">All</option>
						{FOOD_TYPES.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</label>
				<label className="font-semibold text-gray-700 text-sm">
					Date:
					<input
						type="date"
						className="ml-2 border rounded px-2 py-1"
						value={filterDate}
						onChange={(e) => setFilterDate(e.target.value)}
						max={new Date().toISOString().slice(0, 10)}
						style={{ cursor: "pointer" }}
					/>
				</label>
				{(filterType !== "All" || filterDate) && (
					<button
						type="button"
						className="text-blue-700 underline text-sm"
						onClick={() => {
							setFilterType("All");
							setFilterDate("");
						}}
					>
						Clear Filters
					</button>
				)}
			</div>

			{/* --- Transaction Records Table --- */}
			<div className="overflow-x-auto mb-8">
				<table className="min-w-[340px] md:min-w-full bg-white shadow rounded-xl overflow-hidden text-sm">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="px-3 py-2">Date</th>
							<th className="px-3 py-2">Food</th>
							<th className="px-3 py-2">Type</th>
							<th className="px-3 py-2">Qty (kg)</th>
							<th className="px-3 py-2">Source/Purpose</th>
							<th className="px-3 py-2">Notes</th>
							<th className="px-3 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						<AnimatePresence>
							{filteredRecords.map(
								(
									rec: {
										date:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
										foodType:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
										movementType: string;
										quantity:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
										source:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
										purpose:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
										notes:
											| string
											| number
											| bigint
											| boolean
											| React.ReactElement<any, any>
											| Iterable<React.ReactNode>
											| React.ReactPortal
											| Promise<any>
											| null
											| undefined;
									},
									idx: number
								) => (
									<motion.tr
										key={idx}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, x: 30 }}
										transition={{ duration: 0.24 }}
									>
										<td className="px-3 py-1">{rec.date}</td>
										<td className="px-3 py-1">{rec.foodType}</td>
										<td
											className={`px-3 py-1 ${
												rec.movementType === "incoming"
													? "text-green-700"
													: "text-red-700"
											}`}
										>
											{rec.movementType === "incoming"
												? "Incoming"
												: "Outgoing"}
										</td>
										<td className="px-3 py-1">{rec.quantity}</td>
										<td className="px-3 py-1">
											{rec.movementType === "incoming"
												? rec.source
												: rec.purpose}
										</td>
										<td className="px-3 py-1">{rec.notes}</td>
										<td className="px-3 py-1">
											<button
												type="button"
												className="text-red-500 underline text-xs"
												onClick={() => handleUndo(idx)}
											>
												<Undo2 className="inline w-4 h-4 mr-1" /> Undo
											</button>
										</td>
									</motion.tr>
								)
							)}
							{filteredRecords.length === 0 && (
								<tr>
									<td
										colSpan={7}
										className="px-3 py-4 text-center text-gray-400"
									>
										No records found.
									</td>
								</tr>
							)}
						</AnimatePresence>
					</tbody>
				</table>
			</div>
		</div>
	);
}
