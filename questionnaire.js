// Questionnaire component for collecting initial budget information

const Questionnaire = ({ onSubmit, initialStep }) => {
	// State for form fields
	const [formValues, setFormValues] = React.useState({
		paychequeAmount: '',
		depositDates: '',
		expenses: []
	});

	// State for validation errors
	const [errors, setErrors] = React.useState({
		paychequeAmount: '',
		depositDates: '',
		expenses: []
	});

	// Track the current step (step 1: income, step 2: expenses)
	const [currentStep, setCurrentStep] = React.useState(initialStep || 1);

	React.useEffect(() => {
		// Update step when initialStep prop changes
		if (initialStep) {
			setCurrentStep(initialStep);
		}
	}, [initialStep]);

	// Load saved data if available
	React.useEffect(() => {
		const savedData = localStorage.getItem('budgetData');
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				if (parsedData.paychequeAmount || parsedData.depositDates || parsedData.expenses) {
					setFormValues({
						paychequeAmount: parsedData.paychequeAmount || '',
						depositDates: parsedData.depositDates || '',
						expenses: parsedData.expenses || []
					});
				}
			} catch (error) {
				console.error('Error loading saved data in questionnaire:', error);
			}
		}
	}, []);

	// State for current expense being added
	const [currentExpense, setCurrentExpense] = React.useState({
		name: '',
		customName: '',
		amount: '',
		dueDate: ''
	});

	// State for showing calendar
	const [showCalendar, setShowCalendar] = React.useState(false);

	// Common expense categories for dropdown
	const expenseCategories = [
		'Rent/Mortgage',
		'Utilities',
		'Groceries',
		'Car Payment',
		'Insurance',
		'Phone/Internet',
		'Credit Card Payment',
		'Streaming Services',
		'Student Loans',
		'Other'
	];

	// Handle input changes for income step
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value
		});

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: ''
			});
		}
	};

	// Handle changes to the current expense being added
	const handleExpenseChange = (e) => {
		const { name, value } = e.target;
		setCurrentExpense({
			...currentExpense,
			[name]: value
		});
	};

	// Handle due date selection from calendar
	const handleDueDateSelect = (day) => {
		setCurrentExpense({
			...currentExpense,
			dueDate: day
		});
		setShowCalendar(false);
	};

	// Add expense to list
	const addExpense = () => {
		// Get the expense name (use custom if provided, otherwise use dropdown selection)
		const expenseName = currentExpense.customName.trim() || currentExpense.name;

		// Simple validation
		if (!expenseName || !currentExpense.amount || isNaN(currentExpense.amount) || parseFloat(currentExpense.amount) <= 0) {
			alert('Please enter a valid expense name and amount');
			return;
		}

		// Add expense to the list
		setFormValues({
			...formValues,
			expenses: [
				...formValues.expenses,
				{
					name: expenseName,
					amount: currentExpense.amount,
					dueDate: currentExpense.dueDate
				}
			]
		});

		// Reset current expense form
		setCurrentExpense({
			name: '',
			customName: '',
			amount: '',
			dueDate: ''
		});
	};

	// Remove expense from list
	const removeExpense = (index) => {
		const updatedExpenses = [...formValues.expenses];
		updatedExpenses.splice(index, 1);
		setFormValues({
			...formValues,
			expenses: updatedExpenses
		});
	};

	// Validate income form before going to step 2
	const validateIncomeForm = () => {
		let valid = true;
		const newErrors = { paychequeAmount: '', depositDates: '' };

		// Validate paycheque amount (must be a number greater than 0)
		if (!formValues.paychequeAmount || isNaN(formValues.paychequeAmount) || parseFloat(formValues.paychequeAmount) <= 0) {
			newErrors.paychequeAmount = 'Please enter a valid paycheque amount';
			valid = false;
		}

		// Validate deposit dates (must not be empty)
		if (!formValues.depositDates.trim()) {
			newErrors.depositDates = 'Please enter your typical deposit dates';
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	// Handle next button (from income to expenses)
	const handleNextStep = (e) => {
		e.preventDefault();

		if (validateIncomeForm()) {
			setCurrentStep(2);
		}
	};

	// Handle back button (from expenses to income)
	const handleBackStep = () => {
		setCurrentStep(1);
	};

	// Handle final form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		// Submit all form data
		onSubmit({
			paychequeAmount: formValues.paychequeAmount,
			depositDates: formValues.depositDates,
			expenses: formValues.expenses
		});
	};

	// Format day number with appropriate suffix (1st, 2nd, 3rd, etc.)
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

	// Calendar component for selecting the day of month
	const DaySelector = () => {
		// Generate days 1-31 for the calendar
		const days = Array.from({ length: 31 }, (_, i) => i + 1);

		return (
			<div style={{
				position: 'absolute',
				backgroundColor: 'white',
				border: '1px solid #ccc',
				borderRadius: '4px',
				padding: '10px',
				boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
				zIndex: 1000,
				width: '300px'
			}}>
				<div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
					<strong>Select Due Date (Day of Month)</strong>
					<button
						onClick={() => setShowCalendar(false)}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							fontSize: '18px'
						}}
					>
						×
					</button>
				</div>
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(7, 1fr)',
					gap: '5px'
				}}>
					{days.map(day => (
						<button
							key={day}
							onClick={() => handleDueDateSelect(day.toString())}
							style={{
								width: '100%',
								padding: '8px',
								border: currentExpense.dueDate === day.toString() ? '2px solid #1976d2' : '1px solid #ddd',
								borderRadius: '4px',
								background: currentExpense.dueDate === day.toString() ? '#e3f2fd' : 'white',
								cursor: 'pointer'
							}}
						>
							{day}
						</button>
					))}
				</div>
				<div style={{ marginTop: '10px' }}>
					<button
						onClick={() => handleDueDateSelect('Last day')}
						style={{
							width: '100%',
							padding: '8px',
							border: currentExpense.dueDate === 'Last day' ? '2px solid #1976d2' : '1px solid #ddd',
							borderRadius: '4px',
							background: currentExpense.dueDate === 'Last day' ? '#e3f2fd' : 'white',
							cursor: 'pointer'
						}}
					>
						Last day of month
					</button>
				</div>
			</div>
		);
	};

	// Render income information form (step 1)
	const renderIncomeForm = () => (
		<div>
			<h2>Income Information</h2>
			<p>Please provide information about your income to help create your budget.</p>

			<form onSubmit={handleNextStep}>
				<div style={{ marginBottom: '20px' }}>
					<label htmlFor="paychequeAmount">What was the amount of your last paycheque? ($)</label>
					<input
						type="number"
						id="paychequeAmount"
						name="paychequeAmount"
						value={formValues.paychequeAmount}
						onChange={handleChange}
						style={{
							width: '100%',
							padding: '10px',
							border: errors.paychequeAmount ? '1px solid red' : '1px solid #ccc',
							borderRadius: '4px'
						}}
						min="0"
						step="0.01"
					/>
					{errors.paychequeAmount && (
						<div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
							{errors.paychequeAmount}
						</div>
					)}
				</div>

				<div style={{ marginBottom: '20px' }}>
					<label htmlFor="depositDates">When are your paycheques typically deposited each month?</label>
					<input
						type="text"
						id="depositDates"
						name="depositDates"
						value={formValues.depositDates}
						onChange={handleChange}
						placeholder="e.g., 1st and 15th, every Friday, etc."
						style={{
							width: '100%',
							padding: '10px',
							border: errors.depositDates ? '1px solid red' : '1px solid #ccc',
							borderRadius: '4px'
						}}
					/>
					{errors.depositDates && (
						<div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
							{errors.depositDates}
						</div>
					)}
				</div>

				<button
					type="submit"
					style={{
						backgroundColor: '#1976d2',
						color: 'white',
						padding: '10px 20px',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '16px'
					}}
				>
					Next: Add Expenses
				</button>
			</form>
		</div>
	);

	// Render expenses form (step 2)
	const renderExpensesForm = () => (
		<div>
			<h2>Monthly Expenses</h2>
			<p>What are your expenses? Add your regular monthly expenses below. Keep things general at first - we can get more specific later.</p>

			{/* List of already added expenses */}
			{formValues.expenses.length > 0 && (
				<div style={{ marginBottom: '30px' }}>
					<h3>Your Expenses:</h3>
					<div style={{ maxHeight: '300px', overflowY: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ borderBottom: '1px solid #ddd' }}>
									<th style={{ textAlign: 'left', padding: '8px' }}>Expense</th>
									<th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
									<th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
									<th style={{ textAlign: 'left', padding: '8px' }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{formValues.expenses.map((expense, index) => (
									<tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
										<td style={{ padding: '8px' }}>{expense.name}</td>
										<td style={{ padding: '8px' }}>${expense.amount}</td>
										<td style={{ padding: '8px' }}>{formatDayWithSuffix(expense.dueDate) || 'Not specified'}</td>
										<td style={{ padding: '8px' }}>
											<button
												onClick={() => removeExpense(index)}
												style={{
													backgroundColor: '#f44336',
													color: 'white',
													border: 'none',
													borderRadius: '4px',
													padding: '5px 10px',
													cursor: 'pointer'
												}}
											>
												Remove
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Form to add new expense */}
			<div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '20px' }}>
				<h3>Add New Expense</h3>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
					<div style={{ flex: '1 1 250px' }}>
						<label htmlFor="expenseType">Expense Type</label>
						<select
							id="expenseType"
							name="name"
							value={currentExpense.name}
							onChange={handleExpenseChange}
							style={{
								width: '100%',
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								backgroundColor: 'white'
							}}
						>
							<option value="">Select expense type</option>
							{expenseCategories.map((category, index) => (
								<option key={index} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					<div style={{ flex: '1 1 250px' }}>
						<label htmlFor="customName">Custom Expense Name (Optional)</label>
						<input
							type="text"
							id="customName"
							name="customName"
							value={currentExpense.customName}
							onChange={handleExpenseChange}
							placeholder="Enter custom expense name"
							style={{
								width: '100%',
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px'
							}}
						/>
					</div>
				</div>

				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
					<div style={{ flex: '1 1 250px' }}>
						<label htmlFor="amount">Amount ($)</label>
						<input
							type="number"
							id="amount"
							name="amount"
							value={currentExpense.amount}
							onChange={handleExpenseChange}
							placeholder="0.00"
							min="0"
							step="0.01"
							style={{
								width: '100%',
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px'
							}}
						/>
					</div>

					<div style={{ flex: '1 1 250px', position: 'relative' }}>
						<label htmlFor="dueDate">Typically Due On (day of month)</label>
						<div
							onClick={() => setShowCalendar(!showCalendar)}
							style={{
								width: '100%',
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								backgroundColor: 'white',
								cursor: 'pointer',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<span>{formatDayWithSuffix(currentExpense.dueDate) || 'Select due date'}</span>
							<span style={{ fontSize: '18px' }}>▾</span>
						</div>
						{showCalendar && <DaySelector />}
					</div>
				</div>

				<button
					type="button"
					onClick={addExpense}
					style={{
						backgroundColor: '#4caf50',
						color: 'white',
						padding: '10px 20px',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '16px'
					}}
				>
					+ Add Expense
				</button>
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button
					type="button"
					onClick={handleBackStep}
					style={{
						backgroundColor: '#9e9e9e',
						color: 'white',
						padding: '10px 20px',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '16px'
					}}
				>
					Back
				</button>

				<button
					type="button"
					onClick={handleSubmit}
					style={{
						backgroundColor: '#1976d2',
						color: 'white',
						padding: '10px 20px',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '16px'
					}}
					disabled={formValues.expenses.length === 0}
				>
					Complete Budget Setup
				</button>
			</div>
		</div>
	);

	// Modify this to a proper CSS media query for mobile
	const mobileStyles = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            
            nav {
                display: none;
            }
            
            nav.open {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
            }
            
            nav ul li {
                margin: 10px 0;
                text-align: center;
            }
        }
    `;

	// Render the current step
	return (
		<>
			<style>{mobileStyles}</style>
			{currentStep === 1 ? renderIncomeForm() : renderExpensesForm()}
		</>
	);
};