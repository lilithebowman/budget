// Main Budget Application

// Create the main App component
const App = () => {
	const [formData, setFormData] = React.useState({
		paychequeAmount: '',
		depositDates: '',
		expenses: [],
		currentStep: 0
	});

	// Handle form data updates from questionnaire
	const handleQuestionnaireSubmit = (data) => {
		setFormData({
			...formData,
			paychequeAmount: data.paychequeAmount,
			depositDates: data.depositDates,
			expenses: data.expenses || [],
			currentStep: 1
		});
		console.log("Questionnaire data received:", data);
	};

	// Render different forms based on current step
	const renderCurrentForm = () => {
		switch (formData.currentStep) {
			case 0:
				return <Questionnaire onSubmit={handleQuestionnaireSubmit} />;
			case 1:
				return (
					<div>
						<h2>Budget Summary</h2>
						<p>Paycheque Amount: ${formData.paychequeAmount}</p>
						<p>Deposit Dates: {formData.depositDates}</p>

						{formData.expenses && formData.expenses.length > 0 && (
							<div>
								<h3>Monthly Expenses:</h3>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ borderBottom: '1px solid #ddd' }}>
											<th style={{ textAlign: 'left', padding: '8px' }}>Expense</th>
											<th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
											<th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
										</tr>
									</thead>
									<tbody>
										{formData.expenses.map((expense, index) => (
											<tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
												<td style={{ padding: '8px' }}>{expense.name}</td>
												<td style={{ padding: '8px' }}>${expense.amount}</td>
												<td style={{ padding: '8px' }}>{expense.dueDate || 'Not specified'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}

						<button
							style={{
								backgroundColor: '#1976d2',
								color: 'white',
								padding: '10px 20px',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '16px',
								marginTop: '20px'
							}}
							onClick={() => setFormData({ ...formData, currentStep: 0 })}>
							Edit Information
						</button>
					</div>
				);
			default:
				return <Questionnaire onSubmit={handleQuestionnaireSubmit} />;
		}
	};

	return (
		<div style={{ maxWidth: '800px', margin: '0 auto' }}>
			<h1>Personal Budget Planner</h1>
			<div>{renderCurrentForm()}</div>
		</div>
	);
};

// Render the App to the DOM
const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);