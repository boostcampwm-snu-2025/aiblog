import "../styles/global.css";
import { useState } from "react";

import Header from "../ui/Header";
import type { HeaderTabType } from "../types/headerTab";

import GithubPage from "../ui/GithubPage/GithubPage";
import AboutPage from "../ui/AboutPage/AboutPage";

const mainPageStyles = {
	container: {
		display: "grid",
		gap: 16,
	},
};

const MainPage = () => {
	const [currentTab, setCurrentTab] = useState<HeaderTabType>("github");

	return (
		<div className="container" style={mainPageStyles.container}>
			<Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

			{currentTab === "github" && <GithubPage />}
			{currentTab === "about" && <AboutPage />}
		</div>
	);
};

export default MainPage;
