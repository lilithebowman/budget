// Navigation component for budget application

const Navigation = ({ formData, mobileMenuOpen, toggleMobileMenu, navigateToStep }) => {
	return (
		<div className="nav">
			{/* Hamburger icon for mobile */}
			<div className="nav__hamburger" onClick={toggleMobileMenu}>
				<div className="nav__hamburger-line"></div>
				<div className="nav__hamburger-line"></div>
				<div className="nav__hamburger-line"></div>
			</div>

			{/* Navigation menu - desktop and mobile */}
			<nav className={`nav__menu ${mobileMenuOpen ? 'nav__menu--open' : ''}`}>
				<ul className="nav__list">
					<li className="nav__item">
						<button
							onClick={() => navigateToStep(0)}
							className={`nav__button ${formData.currentStep === 0 ? 'nav__button--active' : ''}`}
						>
							Income Information
						</button>
					</li>
					<li className="nav__item">
						<button
							onClick={() => navigateToStep(0.5)}
							className={`nav__button ${formData.currentStep === 0.5 ? 'nav__button--active' : ''}`}
						>
							Expenses
						</button>
					</li>
					<li className="nav__item">
						<button
							onClick={() => navigateToStep(1)}
							className={`nav__button ${formData.currentStep === 1 ? 'nav__button--active' : ''}`}
						>
							Budget Summary
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};