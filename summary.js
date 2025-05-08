// Budget Summary Component

const BudgetSummary = ({ formData, currentMonth, currentYear, handlePrevMonth, handleNextMonth }) => {
	// Format day with appropriate suffix
	const formatDayWithSuffix = (day) => {
		if (!day) return '';

		const num = parseInt(day);
		if (isNaN(num)) return day;

		if (num >= 11 && num <= 13) {
			return num + 'th';
		}

		switch (num % 10) {
			case 1: return num + 'st';
			case 2: return num + 'nd';
			case 3: return num + 'rd';
			default: return num + 'th';
		}
	};

	// Calculate total monthly expenses
	const calculateTotalExpenses = () => {
		if (!formData.expenses || formData.expenses.length === 0) return 0;
		return formData.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
	};

	const totalExpenses = calculateTotalExpenses();
	const remainingAmount = parseFloat(formData.paychequeAmount) - totalExpenses;

	// Calendar Component
	const Calendar = () => {
		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

		// Get number of days in current month
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

		// Get first day of month (0 = Sunday, 1 = Monday, etc.)
		const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

		// Array of day numbers (1 to daysInMonth)
		const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

		// Add empty cells for days before first day of month
		const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);

		// Combine empty cells and days
		const allCells = [...emptyCells, ...days];

		// Calculate expense threshold for color-coding
		const sortedExpenseAmounts = [...formData.expenses]
			.map(exp => parseFloat(exp.amount))
			.sort((a, b) => a - b);

		// Use median as threshold if we have enough expenses
		let threshold = 100; // Default threshold
		if (sortedExpenseAmounts.length > 0) {
			const midIndex = Math.floor(sortedExpenseAmounts.length / 2);
			threshold = sortedExpenseAmounts[midIndex];
		}

		// Get expenses for a specific day
		const getExpensesForDay = (day) => {
			return formData.expenses.filter(expense => {
				if (expense.dueDate === 'Last day' && day === daysInMonth) {
					return true;
				}
				return parseInt(expense.dueDate) === day;
			});
		};

		// Get color class for a day based on expenses
		const getColorClassForDay = (day) => {
			const dayExpenses = getExpensesForDay(day);
			if (dayExpenses.length === 0) return '';

			const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
			return totalAmount > threshold ? 'calendar__day--large-expense' : 'calendar__day--small-expense';
		};

		// Function to create Google Calendar add event URL
		const createGoogleCalendarUrl = (day, expenses) => {
			// Get the date for the reminder (one day before the expense)
			const reminderDate = new Date(currentYear, currentMonth, day - 1);
			const year = reminderDate.getFullYear();
			const month = (reminderDate.getMonth() + 1).toString().padStart(2, '0');
			const date = reminderDate.getDate().toString().padStart(2, '0');

			// Format the expense information for the event details
			let title = "Expense Reminder";
			let details = "Tomorrow's expenses:";

			expenses.forEach(expense => {
				details += `\n- ${expense.name}: $${parseFloat(expense.amount).toFixed(2)}`;
			});

			// Create URL with encoded parameters
			const encodedTitle = encodeURIComponent(title);
			const encodedDetails = encodeURIComponent(details);
			const encodedDate = `${year}${month}${date}`;

			return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&details=${encodedDetails}&dates=${encodedDate}/${encodedDate}&add=true`;
		};

		return (
			<div>
				<div className="calendar__header">
					<button onClick={handlePrevMonth} className="calendar__nav-button">&lt;</button>
					<h3 style={{ margin: 0 }}>{monthNames[currentMonth]} {currentYear}</h3>
					<button onClick={handleNextMonth} className="calendar__nav-button">&gt;</button>
				</div>

				<div className="calendar__grid">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
						<div key={day} className="calendar__day-header">{day}</div>
					))}

					{allCells.map((day, index) => {
						if (day === null) {
							return <div key={`empty-${index}`} style={{ padding: '10px' }}></div>;
						}

						const colorClass = getColorClassForDay(day);
						const dayExpenses = getExpensesForDay(day);
						const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

						return (
							<div
								key={`day-${day}`}
								className={`calendar__day ${colorClass} ${dayExpenses.length > 0 ? 'calendar__day--with-expense' : ''}`}
							>
								<div className="calendar__day-number">{day}</div>
								{dayExpenses.length > 0 && (
									<>
										<div className="calendar__expense-info">
											{dayExpenses.length > 1 ? (
												<div>
													<div className="calendar__total-amount">${totalAmount.toFixed(2)}</div>
													<div>{dayExpenses.length} expenses</div>
												</div>
											) : (
												<div>
													<div>{dayExpenses[0].name}</div>
													<div className="calendar__total-amount">${parseFloat(dayExpenses[0].amount).toFixed(2)}</div>
												</div>
											)}
										</div>

										<a
											href={createGoogleCalendarUrl(day, dayExpenses)}
											target="_blank"
											rel="noopener noreferrer"
											className="calendar__calendar-link"
											title="Add reminder to Google Calendar"
										>
											📅
										</a>
									</>
								)}
							</div>
						);
					})}
				</div>

				<div className="calendar__legend">
					<div className="calendar__legend-item">
						<div className="calendar__legend-color calendar__legend-color--small"></div>
						<span>Small Expenses (Less than ${threshold.toFixed(2)})</span>
					</div>
					<div className="calendar__legend-item">
						<div className="calendar__legend-color calendar__legend-color--large"></div>
						<span>Large Expenses (${threshold.toFixed(2)} or more)</span>
					</div>
				</div>
			</div>
		);
	};

	// Pie Chart Component
	const PieChart = () => {
		const canvasRef = React.useRef(null);

		React.useEffect(() => {
			// Check if there are expenses to display
			if (!formData.expenses || formData.expenses.length === 0) return;

			// Calculate total expenses
			const totalAmount = formData.expenses.reduce((sum, expense) =>
				sum + parseFloat(expense.amount), 0);

			// Group expenses by category
			const expensesByCategory = {};
			const percentagesByCategory = {};

			formData.expenses.forEach(expense => {
				const category = expense.name;
				const amount = parseFloat(expense.amount);
				const percentage = parseFloat(expense.percentage ||
					((amount / totalAmount) * 100).toFixed(1));

				if (!expensesByCategory[category]) {
					expensesByCategory[category] = 0;
				}

				if (!percentagesByCategory[category]) {
					percentagesByCategory[category] = 0;
				}

				expensesByCategory[category] += amount;
				percentagesByCategory[category] += percentage;
			});

			// Convert to format needed for chart
			const labels = Object.keys(expensesByCategory);
			const data = Object.values(expensesByCategory);
			const percentages = Object.values(percentagesByCategory);

			// Generate colors
			const colors = labels.map((_, index) => {
				const hue = (index * 137) % 360; // Golden ratio to create visually distinct colors
				return `hsl(${hue}, 70%, 60%)`;
			});

			// Clear previous chart if it exists
			const ctx = canvasRef.current.getContext('2d');
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			// Draw pie chart
			let startAngle = 0;

			// Draw slices
			percentages.forEach((percentage, index) => {
				// Calculate slice angle based on the percentage
				const sliceAngle = (percentage / 100) * 2 * Math.PI;

				ctx.beginPath();
				ctx.moveTo(150, 150);
				ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle);
				ctx.closePath();

				ctx.fillStyle = colors[index];
				ctx.fill();

				// Draw labels if slice is large enough
				if (sliceAngle > 0.2) {
					const labelAngle = startAngle + sliceAngle / 2;
					const labelX = 150 + Math.cos(labelAngle) * 70;
					const labelY = 150 + Math.sin(labelAngle) * 70;

					ctx.fillStyle = 'white';
					ctx.font = '12px Arial';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(`${Math.round(percentage)}%`, labelX, labelY);
				}

				startAngle += sliceAngle;
			});

			// Improved legend with wider spacing and single column for many items
			const legendY = 310;
			let legendSpacing = 28;  // Vertical spacing between legend items

			// Determine if we need a single column or two columns based on number of items
			let useOneColumn = labels.length > 6;

			// If using one column, use the full width, otherwise use two columns
			if (useOneColumn) {
				// Single column layout - center aligned
				const columnX = 20;

				labels.forEach((label, index) => {
					const amount = data[index];
					const percentage = percentages[index];
					const y = legendY + (index * legendSpacing);

					// Draw color box
					ctx.fillStyle = colors[index];
					ctx.fillRect(columnX, y, 15, 15);

					// Use a smaller font and ellipsis for long labels
					ctx.fillStyle = 'black';
					ctx.font = '12px Arial';
					ctx.textAlign = 'left';
					ctx.textBaseline = 'middle';

					// Format the text with proper spacing
					const displayLabel = label.length > 18 ? label.substring(0, 16) + '...' : label;
					ctx.fillText(`${displayLabel} - $${amount.toFixed(2)} (${percentage.toFixed(1)}%)`, columnX + 20, y + 7);
				});
			} else {
				// Two column layout with improved spacing
				const leftColumnX = 10;
				const rightColumnX = 220;  // Increased from 180 to 220 for more space

				labels.forEach((label, index) => {
					const amount = data[index];
					const percentage = percentages[index];

					// Determine column position
					const x = index % 2 === 0 ? leftColumnX : rightColumnX;
					const y = legendY + Math.floor(index / 2) * legendSpacing;

					// Draw color box
					ctx.fillStyle = colors[index];
					ctx.fillRect(x, y, 15, 15);

					// Use a smaller font and more aggressive ellipsis for long labels
					ctx.fillStyle = 'black';
					ctx.font = '12px Arial';
					ctx.textAlign = 'left';
					ctx.textBaseline = 'middle';

					// More aggressive truncation to prevent overlap
					const displayLabel = label.length > 12 ? label.substring(0, 10) + '...' : label;
					ctx.fillText(`${displayLabel} - $${amount.toFixed(2)} (${percentage.toFixed(1)}%)`, x + 20, y + 7);
				});
			}

		}, [formData.expenses]);

		return (
			<div>
				<h3>Monthly Expenses Breakdown</h3>
				<div className="pie-chart">
					<canvas ref={canvasRef} width="450" height={400} className="pie-chart__canvas" />
				</div>
			</div>
		);
	};

	return (
		<div>
			<h2>Budget Summary</h2>
			<div className="budget-summary__grid">
				<div className="budget-summary__card">
					<h3 className="budget-summary__card-title">Income</h3>
					<p className="budget-summary__amount budget-summary__amount--income">
						${parseFloat(formData.paychequeAmount).toFixed(2)}
					</p>
					<p className="budget-summary__details">
						Deposited: {formData.depositDates}
					</p>
				</div>

				<div className="budget-summary__card">
					<h3 className="budget-summary__card-title">Expenses</h3>
					<p className="budget-summary__amount budget-summary__amount--expense">
						${totalExpenses.toFixed(2)}
					</p>
					<p className="budget-summary__details">
						{formData.expenses.length} monthly payments
					</p>
				</div>

				<div className="budget-summary__card">
					<h3 className="budget-summary__card-title">Remaining</h3>
					<p className={`budget-summary__amount ${remainingAmount >= 0 ? 'budget-summary__amount--positive' : 'budget-summary__amount--negative'}`}>
						${remainingAmount.toFixed(2)}
					</p>
					<p className="budget-summary__details">
						{remainingAmount >= 0 ? 'Available to budget' : 'Deficit'}
					</p>
				</div>
			</div>

			{formData.expenses && formData.expenses.length > 0 && (
				<div>
					<h3>Monthly Expenses:</h3>
					<table className="budget-summary__table">
						<thead>
							<tr>
								<th>Expense</th>
								<th>Amount</th>
								<th>%</th>
								<th>Due Date</th>
							</tr>
						</thead>
						<tbody>
							{formData.expenses.map((expense, index) => {
								// Use stored percentage if available, otherwise calculate it
								const percentage = expense.percentage ||
									((parseFloat(expense.amount) / totalExpenses) * 100).toFixed(1);

								return (
									<tr key={index}>
										<td>{expense.name}</td>
										<td>${parseFloat(expense.amount).toFixed(2)}</td>
										<td>{percentage}%</td>
										<td>{
											expense.dueDate === 'Last day'
												? 'Last day of month'
												: formatDayWithSuffix(expense.dueDate) || 'Not specified'
										}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			<h3>Monthly Payment Schedule</h3>
			<Calendar />

			<PieChart />

			<button
				className="budget-summary__edit-button"
				style={{ display: 'none' }}
				onClick={() => { }}>
				Edit Information
			</button>
		</div>
	);
};

// Make component available globally
window.BudgetSummary = BudgetSummary;