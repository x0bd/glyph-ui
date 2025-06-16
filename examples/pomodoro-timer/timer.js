import {
	h,
	createComponent,
	useState,
	useEffect,
	createApp,
} from "../../packages/runtime/dist/glyphui.js";

// Helper functions
const formatTime = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
};

// SVG Icons
const PlayIcon = () =>
	h(
		"svg",
		{
			class: "btn-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[h("polygon", { points: "5 3 19 12 5 21 5 3" }, [])]
	);

const PauseIcon = () =>
	h(
		"svg",
		{
			class: "btn-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[
			h("rect", { x: "6", y: "4", width: "4", height: "16" }, []),
			h("rect", { x: "14", y: "4", width: "4", height: "16" }, []),
		]
	);

const ResetIcon = () =>
	h(
		"svg",
		{
			class: "btn-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[
			h("path", { d: "M3 2v6h6" }, []),
			h("path", { d: "M3 13a9 9 0 1 0 3-7.7L3 8" }, []),
		]
	);

const SunIcon = () =>
	h(
		"svg",
		{
			class: "btn-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[
			h("circle", { cx: "12", cy: "12", r: "5" }, []),
			h("line", { x1: "12", y1: "1", x2: "12", y2: "3" }, []),
			h("line", { x1: "12", y1: "21", x2: "12", y2: "23" }, []),
			h("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }, []),
			h(
				"line",
				{ x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" },
				[]
			),
			h("line", { x1: "1", y1: "12", x2: "3", y2: "12" }, []),
			h("line", { x1: "21", y1: "12", x2: "23", y2: "12" }, []),
			h("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }, []),
			h("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" }, []),
		]
	);

const MoonIcon = () =>
	h(
		"svg",
		{
			class: "btn-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[
			h(
				"path",
				{ d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
				[]
			),
		]
	);

// Timer Component
const Timer = () => {
	// State
	const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes in seconds
	const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
	const [timeLeft, setTimeLeft] = useState(workTime);
	const [isActive, setIsActive] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [workSessions, setWorkSessions] = useState(0);
	const [breakSessions, setBreakSessions] = useState(0);
	const [showSettings, setShowSettings] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [theme, setTheme] = useState("light");

	// Settings form state
	const [workMinutes, setWorkMinutes] = useState(25);
	const [breakMinutes, setBreakMinutes] = useState(5);

	// Progress calculation
	const totalTime = isBreak ? breakTime : workTime;
	const progress = ((totalTime - timeLeft) / totalTime) * 100;

	// Theme toggle effect
	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
	}, [theme]);

	// Timer effect
	useEffect(() => {
		let interval = null;

		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
		} else if (isActive && timeLeft === 0) {
			// Timer completed
			if (isBreak) {
				// Break finished, switch to work
				setBreakSessions(breakSessions + 1);
				setIsBreak(false);
				setTimeLeft(workTime);

				if (notificationsEnabled) {
					notify("Break finished", "Time to focus!");
				}
			} else {
				// Work finished, switch to break
				setWorkSessions(workSessions + 1);
				setIsBreak(true);
				setTimeLeft(breakTime);

				if (notificationsEnabled) {
					notify("Work session completed", "Time for a break!");
				}
			}
		}

		return () => clearInterval(interval);
	}, [isActive, timeLeft, isBreak, workTime, breakTime]);

	// Handle play/pause
	const toggleTimer = () => {
		setIsActive(!isActive);
	};

	// Handle reset
	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(isBreak ? breakTime : workTime);
	};

	// Handle settings form submission
	const applySettings = (e) => {
		e.preventDefault();

		const newWorkTime = workMinutes * 60;
		const newBreakTime = breakMinutes * 60;

		setWorkTime(newWorkTime);
		setBreakTime(newBreakTime);

		// Reset current timer if needed
		if (!isActive) {
			setTimeLeft(isBreak ? newBreakTime : newWorkTime);
		}

		setShowSettings(false);
	};

	// Handle notifications toggle
	const toggleNotifications = () => {
		if (!notificationsEnabled && "Notification" in window) {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					setNotificationsEnabled(true);
				}
			});
		} else {
			setNotificationsEnabled(!notificationsEnabled);
		}
	};

	// Send notification
	const notify = (title, body) => {
		if ("Notification" in window && Notification.permission === "granted") {
			new Notification(title, {
				body: body,
				icon: "https://example.com/icon.png", // Replace with your icon
			});
		}
	};

	// Toggle theme
	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return h("div", {}, [
		// Timer display
		h("div", { class: `timer-card ${isBreak ? "break" : ""}` }, [
			h("div", { class: "timer-label" }, [
				isBreak ? "Break Time" : "Focus Time",
			]),
			h("div", { class: `timer-display ${isBreak ? "break" : ""}` }, [
				formatTime(timeLeft),
			]),
			h(
				"div",
				{
					class: `timer-progress ${isBreak ? "break" : ""}`,
					style: { width: `${progress}%` },
				},
				[]
			),
		]),

		// Controls
		h("div", { class: "controls" }, [
			h(
				"button",
				{
					class: "btn-primary",
					on: { click: toggleTimer },
				},
				[
					isActive
						? createComponent(PauseIcon)
						: createComponent(PlayIcon),
					isActive ? "Pause" : "Start",
				]
			),
			h(
				"button",
				{
					class: "btn-secondary",
					on: { click: resetTimer },
				},
				[createComponent(ResetIcon), "Reset"]
			),
			h(
				"button",
				{
					class: "btn-secondary",
					on: { click: () => setShowSettings(!showSettings) },
				},
				["Settings"]
			),
			h(
				"button",
				{
					class: "theme-toggle",
					on: { click: toggleTheme },
				},
				[
					theme === "light"
						? createComponent(MoonIcon)
						: createComponent(SunIcon),
				]
			),
		]),

		// Settings
		showSettings &&
			h("div", { class: "settings-card" }, [
				h("div", { class: "settings-title" }, ["Timer Settings"]),
				h(
					"form",
					{
						class: "settings-form",
						on: { submit: applySettings },
					},
					[
						h("div", { class: "form-group" }, [
							h("label", { for: "workTime" }, ["Work Minutes"]),
							h(
								"input",
								{
									id: "workTime",
									type: "number",
									min: "1",
									max: "60",
									value: workMinutes,
									on: {
										input: (e) =>
											setWorkMinutes(
												parseInt(e.target.value) || 25
											),
									},
								},
								[]
							),
						]),
						h("div", { class: "form-group" }, [
							h("label", { for: "breakTime" }, ["Break Minutes"]),
							h(
								"input",
								{
									id: "breakTime",
									type: "number",
									min: "1",
									max: "30",
									value: breakMinutes,
									on: {
										input: (e) =>
											setBreakMinutes(
												parseInt(e.target.value) || 5
											),
									},
								},
								[]
							),
						]),
						h(
							"button",
							{
								class: "btn-primary",
								type: "submit",
								style: {
									gridColumn: "1 / -1",
									marginTop: "1rem",
								},
							},
							["Apply Settings"]
						),
					]
				),
				h("div", { class: "notification-toggle" }, [
					h("label", { class: "toggle-switch" }, [
						h(
							"input",
							{
								type: "checkbox",
								checked: notificationsEnabled,
								on: { change: toggleNotifications },
							},
							[]
						),
						h("span", { class: "toggle-slider" }, []),
					]),
					"Enable Notifications",
				]),
			]),

		// Sessions counter
		h("div", { class: "sessions-card" }, [
			h("h3", { class: "sessions-title" }, ["Session Stats"]),
			h("div", { class: "sessions-counter" }, [
				h("div", { class: "counter-item" }, [
					h("div", { class: "counter-value" }, [workSessions]),
					h("div", { class: "counter-label" }, ["Work Sessions"]),
				]),
				h("div", { class: "counter-item" }, [
					h("div", { class: "counter-value break" }, [breakSessions]),
					h("div", { class: "counter-label" }, ["Break Sessions"]),
				]),
			]),
		]),
	]);
};

// Initialize the app
const app = createApp({
	view: () => createComponent(Timer),
});

// Mount the app
app.mount(document.getElementById("app"));
