import "../styles/global.css";

import { useState } from "react";

import Header from "../ui/Header";
import type { HeaderTabType } from "../types/headerTab";

const MainPage = () => {
	const [currentTab, setCurrentTab] = useState<HeaderTabType>("github");
	return (
		<div className="container">
			<Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
		</div>
	);
};

export default MainPage;
