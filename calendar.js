// Multi-date calendar selector component

/**
 * A reusable calendar component that allows selection of multiple dates
 * 
 * @param {Object} props Component properties
 * @param {number[]} props.selectedDates Array of currently selected dates (days of month)
 * @param {function} props.onDateSelect Callback when a date is selected/deselected
 * @param {function} props.onClose Callback when calendar is closed
 * @param {string} props.title Title to display at the top of the calendar
 * @param {boolean} props.allowMultiple Whether to allow multiple date selection (true) or just one (false)
 * @param {boolean} props.showLastDay Whether to show "Last day of month" option
 * @param {function} props.onLastDaySelect Callback when "Last day of month" is selected
 * @param {boolean} props.isLastDaySelected Whether "Last day of month" is currently selected
 */
const MultiDateCalendar = ({
	selectedDates = [],
	onDateSelect,
	onClose,
	title = "Select Dates",
	allowMultiple = true,
	showLastDay = false,
	onLastDaySelect = null,
	isLastDaySelected = false
}) => {
	// Generate days 1-31 for the calendar
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	// Function to handle day selection
	const handleDaySelect = (day) => {
		if (allowMultiple) {
			// In multi-select mode, toggle the selected state
			if (selectedDates.includes(day)) {
				// If already selected, remove it
				onDateSelect(selectedDates.filter(d => d !== day));
			} else {
				// If not selected, add it
				const newDates = [...selectedDates, day];
				// Sort dates in ascending order
				newDates.sort((a, b) => a - b);
				onDateSelect(newDates);
			}
		} else {
			// In single-select mode, just return the selected day
			onDateSelect(day);
			// Optionally close the calendar after selection in single-select mode
			if (onClose) onClose();
		}
	};

	// Function to handle last day selection
	const handleLastDaySelect = () => {
		if (onLastDaySelect) {
			onLastDaySelect();
			// In single-select mode, close after selection
			if (!allowMultiple && onClose) onClose();
		}
	};

	return (
		<div className="calendar-selector">
			<div className="calendar-selector__header">
				<strong>{title}</strong>
				{onClose && (
					<button
						onClick={onClose}
						className="calendar-selector__close-button"
						type="button"
						aria-label="Close calendar"
					>
						×
					</button>
				)}
			</div>

			<div className="calendar-selector__grid">
				{days.map(day => (
					<button
						key={day}
						onClick={() => handleDaySelect(day)}
						className={`calendar-selector__day ${allowMultiple
								? selectedDates.includes(day) ? 'calendar-selector__day--selected' : ''
								: selectedDates === day ? 'calendar-selector__day--selected' : ''
							}`}
						type="button"
					>
						{day}
					</button>
				))}
			</div>

			{showLastDay && (
				<div className="calendar-selector__footer">
					<button
						onClick={handleLastDaySelect}
						className={`calendar-selector__special-day ${isLastDaySelected ? 'calendar-selector__special-day--selected' : ''
							}`}
						type="button"
					>
						Last day of month
					</button>
				</div>
			)}

			{allowMultiple && selectedDates.length > 0 && (
				<div className="calendar-selector__hint">
					{selectedDates.length} {selectedDates.length === 1 ? 'date' : 'dates'} selected
				</div>
			)}
		</div>
	);
};

/**
 * A container component that handles the state and display logic for the calendar selector
 * 
 * @param {Object} props Component properties 
 * @param {number[]} props.value Currently selected dates as array
 * @param {function} props.onChange Callback with new selected dates array
 * @param {string} props.placeholder Text to show when no dates are selected
 * @param {string} props.label Label text for the field
 * @param {boolean} props.allowMultiple Whether to allow multiple selections
 * @param {boolean} props.showLastDay Whether to show last day of month option
 * @param {boolean|string} props.error Error message or false if no error
 */
const DateSelector = ({
	value = [],
	onChange,
	placeholder = "Select date(s)",
	label = "Select dates",
	allowMultiple = true,
	showLastDay = false,
	error = false
}) => {
	// State to track if calendar is visible
	const [isOpen, setIsOpen] = React.useState(false);

	// State to track if "Last day of month" is selected
	const [isLastDaySelected, setIsLastDaySelected] = React.useState(false);

	// Format day numbers with appropriate suffix (1st, 2nd, 3rd, etc.)
	const formatDayWithSuffix = (day) => {
		if (!day) return '';

		const num = parseInt(day);
		if (isNaN(num)) return day;

		if (num >= 11 && num <= 13) return num + 'th';

		switch (num % 10) {
			case 1: return num + 'st';
			case 2: return num + 'nd';
			case 3: return num + 'rd';
			default: return num + 'th';
		}
	};

	// Format the selected dates for display
	const formatSelectedDates = () => {
		if (isLastDaySelected) return "Last day of month";

		if (!allowMultiple) {
			// For single select, value is a number not an array
			return value ? formatDayWithSuffix(value) : placeholder;
		}

		if (!value || value.length === 0) return placeholder;

		// Format each date with suffix and join with commas
		return value.map(day => formatDayWithSuffix(day)).join(', ');
	};

	// Toggle the last day selection
	const handleLastDaySelect = () => {
		setIsLastDaySelected(!isLastDaySelected);
		// If this is single select mode
		if (!allowMultiple) {
			onChange('Last day');
		}
	};

	// Handle date selection
	const handleDateSelect = (dates) => {
		onChange(dates);
		// Unselect "Last day" if any specific days are selected
		if (isLastDaySelected &&
			((allowMultiple && dates.length > 0) ||
				(!allowMultiple && dates))) {
			setIsLastDaySelected(false);
		}
	};

	return (
		<div className="date-selector">
			{label && <label className="date-selector__label">{label}</label>}

			<div className="date-selector__container">
				<div
					onClick={() => setIsOpen(!isOpen)}
					className={`date-selector__display ${error ? 'date-selector__display--error' : ''}`}
				>
					<span>{formatSelectedDates()}</span>
					<span className="dropdown-arrow">▾</span>
				</div>

				{isOpen && (
					<div className="date-selector__calendar-container">
						<MultiDateCalendar
							selectedDates={value}
							onDateSelect={handleDateSelect}
							onClose={() => setIsOpen(false)}
							title={label}
							allowMultiple={allowMultiple}
							showLastDay={showLastDay}
							onLastDaySelect={handleLastDaySelect}
							isLastDaySelected={isLastDaySelected}
						/>
					</div>
				)}

				{error && (
					<div className="date-selector__error">{error}</div>
				)}
			</div>

			{/* Display selected dates as removable tags if in multiple selection mode */}
			{allowMultiple && value && value.length > 0 && (
				<div className="selected-dates">
					<div className="selected-dates__tags">
						{value.map(day => (
							<span key={day} className="selected-dates__tag">
								{formatDayWithSuffix(day)}
								<button
									onClick={() => handleDateSelect(value.filter(d => d !== day))}
									className="selected-dates__remove"
									type="button"
									aria-label={`Remove ${formatDayWithSuffix(day)}`}
								>
									×
								</button>
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

// Export both components
const Calendar = {
	MultiDateCalendar,
	DateSelector
};

// Export default and named exports for flexibility
export default Calendar;
export { MultiDateCalendar, DateSelector };