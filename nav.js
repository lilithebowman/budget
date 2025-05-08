// Navigation component for budget application

const Navigation = ({ formData, mobileMenuOpen, toggleMobileMenu, navigateToStep }) => {
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
						flexDirection: 'column',
						alignItems: 'center',
						gap: '10px'
					}
				}}>
					<li style={{
						margin: '0 15px',
						width: '100%',
						'@media (max-width: 768px)': {
							margin: '5px 0',
							textAlign: 'center'
						}
					}}>
						<button
							onClick={() => navigateToStep(0)}
							style={{
								textDecoration: 'none',
								color: formData.currentStep === 0 ? '#1976d2' : '#333',
								fontWeight: formData.currentStep === 0 ? 'bold' : 'normal',
								cursor: 'pointer',
								padding: '8px 12px',
								borderRadius: '4px',
								backgroundColor: 'transparent',
								border: 'none',
								borderBottom: formData.currentStep === 0 ? '2px solid #1976d2' : 'none',
								width: '100%',
								'@media (max-width: 768px)': {
									width: '80%'
								}
							}}
						>
							Income Information
						</button>
					</li>
					<li style={{
						margin: '0 15px',
						width: '100%',
						'@media (max-width: 768px)': {
							margin: '5px 0',
							textAlign: 'center'
						}
					}}>
						<button
							onClick={() => navigateToStep(0.5)}
							style={{
								textDecoration: 'none',
								color: formData.currentStep === 0.5 ? '#1976d2' : '#333',
								fontWeight: formData.currentStep === 0.5 ? 'bold' : 'normal',
								cursor: 'pointer',
								padding: '8px 12px',
								borderRadius: '4px',
								backgroundColor: 'transparent',
								border: 'none',
								borderBottom: formData.currentStep === 0.5 ? '2px solid #1976d2' : 'none',
								width: '100%',
								'@media (max-width: 768px)': {
									width: '80%'
								}
							}}
						>
							Expenses
						</button>
					</li>
					<li style={{
						margin: '0 15px',
						width: '100%',
						'@media (max-width: 768px)': {
							margin: '5px 0',
							textAlign: 'center'
						}
					}}>
						<button
							onClick={() => navigateToStep(1)}
							style={{
								textDecoration: 'none',
								color: formData.currentStep === 1 ? '#1976d2' : '#333',
								fontWeight: formData.currentStep === 1 ? 'bold' : 'normal',
								cursor: 'pointer',
								padding: '8px 12px',
								borderRadius: '4px',
								backgroundColor: 'transparent',
								border: 'none',
								borderBottom: formData.currentStep === 1 ? '2px solid #1976d2' : 'none',
								width: '100%',
								'@media (max-width: 768px)': {
									width: '80%'
								}
							}}
						>
							Budget Summary
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};