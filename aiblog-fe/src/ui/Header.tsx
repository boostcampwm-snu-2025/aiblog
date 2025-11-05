const headerStyles = {
	container: {
		paddingTop: 14,
		paddingBottom: 14,
	},
	blackName: {
		color: "var(--pink-700)",
	},
	pinkName: {
		padding: "6px 10px",
		borderRadius: "10px",
	},
};

const Header = () => {
	return (
		<header className="app-header">
			<div className="container" style={headerStyles.container}>
				<h1 className="app-title">
					<span style={headerStyles.pinkName}>김희원의</span>
					<span style={headerStyles.blackName}>Smart Dev Blog</span>
				</h1>
			</div>
		</header>
	);
};

export default Header;
