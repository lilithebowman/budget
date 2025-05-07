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

    // Navigation Component
    const Navigation = () => {
        return (
            <div style={{
                marginBottom: '20px',
                position: 'relative'
            }}>
                {/* Hamburger icon for mobile */}
                <div
                    className="mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    style={{
                        display: 'none', // Hide on desktop
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        zIndex: 100,
                        cursor: 'pointer',
                        padding: '5px',
                        '@media (max-width: 768px)': {
                            display: 'block' // Show on mobile
                        }
                    }}
                >
                    <div style={{
                        width: '25px',
                        height: '3px',
                        backgroundColor: '#333',
                        margin: '5px 0',
                        transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{
                        width: '25px',
                        height: '3px',
                        backgroundColor: '#333',
                        margin: '5px 0',
                        transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{
                        width: '25px',
                        height: '3px',
                        backgroundColor: '#333',
                        margin: '5px 0',
                        transition: 'all 0.3s ease'
                    }}></div>
                </div>

                {/* Navigation menu - desktop and mobile */}
                <nav style={{
                    backgroundColor: '#f5f5f5',
                    padding: '10px 0',
                    borderRadius: '4px',
                    display: 'block', // Always visible on desktop
                    '@media (max-width: 768px)': {
                        display: mobileMenuOpen ? 'block' : 'none' // Toggle on mobile
                    }
                }}>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        '@media (max-width: 768px)': {
                            flexDirection: 'column'
                        }
                    }}>
                        <li style={{
                            margin: '0 15px',
                            '@media (max-width: 768px)': {
                                margin: '10px 0',
                                textAlign: 'center'
                            }
                        }}>
                            <a
                                onClick={() => navigateToStep(0)}
                                style={{
                                    textDecoration: 'none',
                                    color: formData.currentStep === 0 ? '#1976d2' : '#333',
                                    fontWeight: formData.currentStep === 0 ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderBottom: formData.currentStep === 0 ? '2px solid #1976d2' : 'none'
                                }}
                            >
                                Income Information
                            </a>
                        </li>
                        <li style={{
                            margin: '0 15px',
                            '@media (max-width: 768px)': {
                                margin: '10px 0',
                                textAlign: 'center'
                            }
                        }}>
                            <a
                                onClick={() => navigateToStep(0.5)}
                                style={{
                                    textDecoration: 'none',
                                    color: formData.currentStep === 0.5 ? '#1976d2' : '#333',
                                    fontWeight: formData.currentStep === 0.5 ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderBottom: formData.currentStep === 0.5 ? '2px solid #1976d2' : 'none'
                                }}
                            >
                                Expenses
                            </a>
                        </li>
                        <li style={{
                            margin: '0 15px',
                            '@media (max-width: 768px)': {
                                margin: '10px 0',
                                textAlign: 'center'
                            }
                        }}>
                            <a
                                onClick={() => navigateToStep(1)}
                                style={{
                                    textDecoration: 'none',
                                    color: formData.currentStep === 1 ? '#1976d2' : '#333',
                                    fontWeight: formData.currentStep === 1 ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderBottom: formData.currentStep === 1 ? '2px solid #1976d2' : 'none'
                                }}
                            >
                                Budget Summary
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
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
        // Sort expenses by amount for threshold calculation
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

        // Get color for a day based on expenses
        const getColorForDay = (day) => {
            const dayExpenses = getExpensesForDay(day);
            if (dayExpenses.length === 0) return '';

            const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            return totalAmount > threshold ? '#2196f3' : '#4caf50'; // Blue for larger, green for smaller
        };

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <button
                        onClick={handlePrevMonth}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        &lt;
                    </button>
                    <h3 style={{ margin: 0 }}>{monthNames[currentMonth]} {currentYear}</h3>
                    <button
                        onClick={handleNextMonth}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        &gt;
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '5px',
                    marginBottom: '30px'
                }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div
                            key={day}
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px'
                            }}
                        >
                            {day}
                        </div>
                    ))}

                    {allCells.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} style={{ padding: '10px' }}></div>;
                        }

                        const color = getColorForDay(day);
                        const dayExpenses = getExpensesForDay(day);
                        const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

                        return (
                            <div
                                key={`day-${day}`}
                                style={{
                                    position: 'relative',
                                    height: '80px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '5px',
                                    backgroundColor: color ? `${color}20` : '', // 20% opacity
                                    borderLeft: color ? `4px solid ${color}` : '1px solid #ddd'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>{day}</div>
                                {dayExpenses.length > 0 && (
                                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                        {dayExpenses.length > 1 ? (
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</div>
                                                <div>{dayExpenses.length} expenses</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div>{dayExpenses[0].name}</div>
                                                <div style={{ fontWeight: 'bold' }}>${parseFloat(dayExpenses[0].amount).toFixed(2)}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ width: '15px', height: '15px', backgroundColor: '#4caf50', marginRight: '5px' }}></div>
                        <span>Small Expenses (Less than ${threshold.toFixed(2)})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '15px', height: '15px', backgroundColor: '#2196f3', marginRight: '5px' }}></div>
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
            // Load the localStorage data
            const savedData = localStorage.getItem('budgetData');
            const parsedData = JSON.parse(savedData);
            // Check if there are expenses to display
            if (!parsedData.expenses || parsedData.expenses.length === 0) return;

            // Calculate total expenses
            const totalAmount = parsedData.expenses.reduce((sum, expense) =>
                sum + parseFloat(expense.amount), 0);

            // Group expenses by category
            const expensesByCategory = {};
            const percentagesByCategory = {};

            parsedData.expenses.forEach(expense => {
                const category = expense.name;
                const amount = parseFloat(expense.amount);
                const percentage = parseFloat(expense.percentage);

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

            // Draw legend
            const legendY = 310;
            labels.forEach((label, index) => {
                const amount = data[index];
                const percentage = percentages[index];
                const x = 20 + (index % 2) * 160;
                const y = legendY + Math.floor(index / 2) * 25;

                ctx.fillStyle = colors[index];
                ctx.fillRect(x, y, 15, 15);

                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${label} - $${amount.toFixed(2)} (${percentage.toFixed(1)}%)`, x + 20, y + 7);
            });

        }, [formData.expenses]);

        return (
            <div>
                <h3>Monthly Expenses Breakdown</h3>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <canvas ref={canvasRef} width="300" height={400} style={{ maxWidth: '100%' }} />
                </div>
            </div>
        );
    };

    // Calculate total monthly expenses
    const calculateTotalExpenses = () => {
        if (!formData.expenses || formData.expenses.length === 0) return 0;
        return formData.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    };

    // Modified renderCurrentForm function to handle the new step for expenses
    const renderCurrentForm = () => {
        switch (formData.currentStep) {
            case 0:
                return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={1} />;
            case 0.5:
                return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={2} />;
            case 1:
                const totalExpenses = calculateTotalExpenses();
                const remainingAmount = parseFloat(formData.paychequeAmount) - totalExpenses;

                return (
                    <div>
                        <h2>Budget Summary</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Income</h3>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50', margin: '0' }}>
                                    ${parseFloat(formData.paychequeAmount).toFixed(2)}
                                </p>
                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                    Deposited: {formData.depositDates}
                                </p>
                            </div>

                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Expenses</h3>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336', margin: '0' }}>
                                    ${totalExpenses.toFixed(2)}
                                </p>
                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                    {formData.expenses.length} monthly payments
                                </p>
                            </div>

                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Remaining</h3>
                                <p style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: remainingAmount >= 0 ? '#4caf50' : '#f44336',
                                    margin: '0'
                                }}>
                                    ${remainingAmount.toFixed(2)}
                                </p>
                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                    {remainingAmount >= 0 ? 'Available to budget' : 'Deficit'}
                                </p>
                            </div>
                        </div>

                        {formData.expenses && formData.expenses.length > 0 && (
                            <div>
                                <h3>Monthly Expenses:</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                                            <th style={{ textAlign: 'left', padding: '8px' }}>Expense</th>
                                            <th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
                                            <th style={{ textAlign: 'left', padding: '8px' }}>%</th>
                                            <th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.expenses.map((expense, index) => {
                                            // Use stored percentage if available, otherwise calculate it
                                            const percentage = expense.percentage ||
                                                ((parseFloat(expense.amount) / totalExpenses) * 100).toFixed(1);

                                            return (
                                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                                    <td style={{ padding: '8px' }}>{expense.name}</td>
                                                    <td style={{ padding: '8px' }}>${parseFloat(expense.amount).toFixed(2)}</td>
                                                    <td style={{ padding: '8px' }}>{percentage}%</td>
                                                    <td style={{ padding: '8px' }}>{
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
                return <Questionnaire onSubmit={handleQuestionnaireSubmit} initialStep={1} />;
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Personal Budget Planner</h1>
            <Navigation />
            <div>{renderCurrentForm()}</div>
        </div>
    );
};

// Render the App to the DOM
const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);