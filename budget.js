// Main Budget Application

// Create the main App component
const App = () => {
	const [formData, setFormData] = React.useState({
		paychequeAmount: '',
		depositDates: '',
		expenses: [],
		currentStep: 0
	});

	const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
	// State for mobile menu toggle
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	// Load data from localStorage on initial render
	React.useEffect(() => {
		const savedData = localStorage.getItem('budgetData');
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				setFormData(parsedData);
			} catch (error) {
				console.error('Error loading saved data:', error);
			}
		}
	}, []);

	// Save data to localStorage whenever it changes
	React.useEffect(() => {
		localStorage.setItem('budgetData', JSON.stringify(formData));
	}, [formData]);

	// Toggle mobile menu
	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	// Navigate to a specific step
	const navigateToStep = (step) => {
		setFormData({ ...formData, currentStep: step });
		setMobileMenuOpen(false); // Close mobile menu after navigation
	};

	// Add a function to calculate and attach percentages to expenses
	const calculateExpensePercentages = (expenses) => {
		if (!expenses || expenses.length === 0) return expenses;

		// Calculate total
		const totalExpenses = expenses.reduce((sum, expense) =>
			sum + parseFloat(expense.amount), 0);

		// Add percentage to each expense
		return expenses.map(expense => {
			const percentage = (parseFloat(expense.amount) / totalExpenses) * 100;
			return {
				...expense,
				percentage: percentage.toFixed(1)
			};
		});
	};

	// Handle form data updates from questionnaire
	const handleQuestionnaireSubmit = (data) => {
		// Calculate percentages for expenses
		const expensesWithPercentages = calculateExpensePercentages(data.expenses || []);

		const updatedData = {
			...formData,
			paychequeAmount: data.paychequeAmount,
			depositDates: data.depositDates,
			expenses: expensesWithPercentages,
			currentStep: 1
		};

		setFormData(updatedData);
		localStorage.setItem('budgetData', JSON.stringify(updatedData));
		console.log("Questionnaire data received:", data);
	};

	// Handle month navigation
	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};

	// Modified renderCurrentForm function to handle the new step for expenses
	const renderCurrentForm = () => {
		switch (formData.currentStep) {
			case 0:
				return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={1} />;
			case 0.5:
				return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={2} />;
			case 1:
				return (
					<BudgetSummary
						formData={formData}
						currentMonth={currentMonth}
						currentYear={currentYear}
						handlePrevMonth={handlePrevMonth}
						handleNextMonth={handleNextMonth}
					/>
				);
			default:
				return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={1} />;
		}
	};

	return (
		<div className="container">
			<h1>Personal Budget Planner</h1>
			<Navigation
				formData={formData}
				mobileMenuOpen={mobileMenuOpen}
				toggleMobileMenu={toggleMobileMenu}
				navigateToStep={navigateToStep}
			/>
			<div>{renderCurrentForm()}</div>
		</div>
	);
};

// Render the App to the DOM
const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);