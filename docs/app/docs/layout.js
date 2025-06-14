export default function DocsLayout({ children }) {
	return (
		<div className="flex min-h-screen flex-col md:flex-row">
			{/* Sidebar */}
			<aside className="w-full md:w-64 border-r border-border bg-background">
				<div className="sticky top-0 p-6 space-y-6 h-screen overflow-y-auto">
					<div className="flex items-center gap-3 mb-8">
						<div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold">
							G
						</div>
						<div className="font-mono text-lg font-bold tracking-tighter">
							<a
								href="/"
								className="hover:text-primary transition-colors"
							>
								GLYPH/UI
							</a>
						</div>
					</div>

					<div className="relative">
						<div className="absolute -left-3 top-0 bottom-0 w-px bg-border"></div>
						<nav className="space-y-8 relative">
							<div>
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1.5 h-1.5 bg-primary"></div>
									<h3 className="font-mono text-xs text-muted-foreground uppercase">
										Getting Started
									</h3>
								</div>
								<ul className="space-y-2 pl-3">
									<li>
										<a
											href="/docs/installation"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											Installation
										</a>
									</li>
									<li>
										<a
											href="/docs/getting-started"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											Getting Started
										</a>
									</li>
								</ul>
							</div>

							<div>
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1.5 h-1.5 bg-primary"></div>
									<h3 className="font-mono text-xs text-muted-foreground uppercase">
										Components
									</h3>
								</div>
								<ul className="space-y-2 pl-3">
									<li>
										<a
											href="/docs/components/button"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											Button
										</a>
									</li>
									<li>
										<a
											href="/docs/components/input"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											Input
										</a>
									</li>
									<li>
										<a
											href="/docs/components/card"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											Card
										</a>
									</li>
								</ul>
							</div>

							<div>
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1.5 h-1.5 bg-primary"></div>
									<h3 className="font-mono text-xs text-muted-foreground uppercase">
										Hooks
									</h3>
								</div>
								<ul className="space-y-2 pl-3">
									<li>
										<a
											href="/docs/hooks/use-state"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											useState
										</a>
									</li>
									<li>
										<a
											href="/docs/hooks/use-effect"
											className="font-mono text-sm hover:text-primary transition-colors block py-1 border-l border-transparent pl-3 -ml-px hover:border-primary"
										>
											useEffect
										</a>
									</li>
								</ul>
							</div>
						</nav>
					</div>

					<div className="mt-12 pt-6 border-t border-border">
						<div className="bg-muted p-4 rounded-sm">
							<div className="font-mono text-xs font-bold mb-2">
								NEED HELP?
							</div>
							<p className="font-mono text-xs text-muted-foreground mb-3">
								Check our GitHub repository or join our
								community.
							</p>
							<a
								href="https://github.com/your-username/glyph-ui"
								target="_blank"
								rel="noopener noreferrer"
								className="font-mono text-xs flex items-center gap-1 hover:text-primary transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
								</svg>
								GitHub Repository
							</a>
						</div>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 p-6 md:p-10 bg-background">
				<div className="max-w-3xl mx-auto">
					{children}

					<div className="mt-24 pt-6 border-t border-border">
						<div className="flex justify-between items-center">
							<div className="font-mono text-xs text-muted-foreground">
								© {new Date().getFullYear()} GLYPH/UI
							</div>
							<div className="flex gap-4">
								<a
									href="/docs"
									className="font-mono text-xs hover:text-primary transition-colors"
								>
									Docs
								</a>
								<a
									href="/components"
									className="font-mono text-xs hover:text-primary transition-colors"
								>
									Components
								</a>
								<a
									href="/examples"
									className="font-mono text-xs hover:text-primary transition-colors"
								>
									Examples
								</a>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
