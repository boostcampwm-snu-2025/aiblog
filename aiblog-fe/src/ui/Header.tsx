import type { CSSProperties } from "react";
import type { HeaderTabType } from "../types/headerTab";

interface HeaderProps {
	currentTab: HeaderTabType;
	setCurrentTab: (tab: HeaderTabType) => void;
}

const headerStyles: Record<string, CSSProperties> = {
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "10px 14px",
	},
	rightTabs: {
		display: "flex",
		gap: "20px",
		fontSize: "1rem",
		fontWeight: 500,
	},
	tab: {
		cursor: "pointer",
		color: "var(--gray-700)",
	},
	tabActive: {
		color: "var(--pink-700)",
		fontWeight: 600,
	},
	blackName: {
		color: "var(--pink-700)",
	},
	pinkName: {
		padding: "6px 10px",
		borderRadius: "10px",
	},
};

const Header = ({ currentTab, setCurrentTab }: HeaderProps) => {
	return (
		<header className="app-header">
			<div className="container" style={headerStyles.container}>
				<h1 className="app-title">
					<span style={headerStyles.pinkName}>김희원의</span>
					<span style={headerStyles.blackName}>Smart Dev Blog</span>
				</h1>

				<nav style={headerStyles.rightTabs}>
					<span
						style={
							currentTab === "github"
								? headerStyles.tabActive
								: headerStyles.tab
						}
						onClick={() => setCurrentTab("github")}
					>
						GitHub
					</span>
					<span
						style={
							currentTab === "posts" ? headerStyles.tabActive : headerStyles.tab
						}
						onClick={() => setCurrentTab("posts")}
					>
						Posts
					</span>
					<span
						style={
							currentTab === "about" ? headerStyles.tabActive : headerStyles.tab
						}
						onClick={() => setCurrentTab("about")}
					>
						About
					</span>
				</nav>
			</div>
		</header>
	);
};

export default Header;
