export default function DocsPage() {
	return (
		<article className="space-y-12">
			<header className="border-b border-border pb-6 mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="inline-block bg-foreground text-background px-3 py-1 font-mono text-xs">
						DOCUMENTATION
					</div>
					<div className="h-px bg-border flex-grow"></div>
				</div>
				<h1 className="font-mono text-4xl font-bold tracking-tighter flex items-center gap-4">
					<div className="w-10 h-10 bg-foreground text-background flex items-center justify-center font-mono text-sm font-bold rounded-full">
						G
					</div>
					GLYPH/UI DOCS
				</h1>
			</header>

			<section className="space-y-8">
				<div className="flex gap-4 items-start">
					<div className="w-1 h-8 bg-primary mt-1"></div>
					<p className="font-mono text-lg">
						Welcome to the GlyphUI documentation. This guide will
						help you get started with GlyphUI, a minimal,
						accessible, and customizable component library for React
						applications.
					</p>
				</div>

				<div className="relative py-6">
					<div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
						<a href="/docs/installation" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-xs">
										01
									</div>
									<h3 className="font-mono text-xl font-bold">
										INSTALLATION
									</h3>
								</div>
								<p className="font-mono text-muted-foreground text-sm pl-11">
									Learn how to install and set up GlyphUI in
									your project
								</p>
								<div className="mt-4 pl-11 font-mono text-xs flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
									<span>READ MORE</span>
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
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
							</div>
						</a>
						<a href="/docs/getting-started" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-xs">
										02
									</div>
									<h3 className="font-mono text-xl font-bold">
										GETTING STARTED
									</h3>
								</div>
								<p className="font-mono text-muted-foreground text-sm pl-11">
									Build your first UI with GlyphUI components
								</p>
								<div className="mt-4 pl-11 font-mono text-xs flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
									<span>READ MORE</span>
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
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
							</div>
						</a>
					</div>
				</div>

				<div className="mt-12">
					<div className="flex items-center gap-4 mb-8">
						<div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono text-xs rounded-full">
							C
						</div>
						<h2 className="font-mono text-2xl font-bold tracking-tighter">
							COMPONENTS
						</h2>
						<div className="h-px bg-border flex-grow"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-1">
						<a href="/docs/components/button" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-mono text-lg font-bold">
										BUTTON
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
								<p className="font-mono text-muted-foreground text-sm">
									Interactive button element
								</p>
								<div className="mt-4 pt-4 border-t border-border">
									<div className="bg-foreground text-background font-mono text-xs py-1 px-2 inline-block">
										EXAMPLE
									</div>
								</div>
							</div>
						</a>
						<a href="/docs/components/input" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-mono text-lg font-bold">
										INPUT
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
								<p className="font-mono text-muted-foreground text-sm">
									Form input controls
								</p>
								<div className="mt-4 pt-4 border-t border-border">
									<div className="bg-foreground text-background font-mono text-xs py-1 px-2 inline-block">
										EXAMPLE
									</div>
								</div>
							</div>
						</a>
						<a href="/docs/components/card" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-mono text-lg font-bold">
										CARD
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
								<p className="font-mono text-muted-foreground text-sm">
									Container for related content
								</p>
								<div className="mt-4 pt-4 border-t border-border">
									<div className="bg-foreground text-background font-mono text-xs py-1 px-2 inline-block">
										EXAMPLE
									</div>
								</div>
							</div>
						</a>
					</div>
				</div>

				<div className="mt-12">
					<div className="flex items-center gap-4 mb-8">
						<div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono text-xs rounded-full">
							H
						</div>
						<h2 className="font-mono text-2xl font-bold tracking-tighter">
							HOOKS
						</h2>
						<div className="h-px bg-border flex-grow"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<a href="/docs/hooks/use-state" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-mono text-lg font-bold">
										USE-STATE
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
								<p className="font-mono text-muted-foreground text-sm">
									State management hook
								</p>
								<div className="mt-4 pt-4 border-t border-border">
									<code className="font-mono text-xs text-primary">
										const [state, setState] =
										useState(initialState)
									</code>
								</div>
							</div>
						</a>
						<a href="/docs/hooks/use-effect" className="group">
							<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-mono text-lg font-bold">
										USE-EFFECT
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
								<p className="font-mono text-muted-foreground text-sm">
									Side effects hook
								</p>
								<div className="mt-4 pt-4 border-t border-border">
									<code className="font-mono text-xs text-primary">
										useEffect(effectFunction, dependencies)
									</code>
								</div>
							</div>
						</a>
					</div>
				</div>
			</section>

			<div className="bg-muted border border-border p-6 mt-16">
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 bg-foreground text-background flex items-center justify-center font-mono text-xl font-bold rounded-full">
						?
					</div>
					<div>
						<h3 className="font-mono text-lg font-bold mb-3">
							NEED HELP?
						</h3>
						<p className="font-mono text-sm mb-6 text-muted-foreground">
							If you're having trouble with GlyphUI, check out
							these resources:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<a
								href="https://github.com/your-username/glyph-ui/issues"
								className="flex items-center gap-3 p-4 border border-border bg-background hover:bg-muted transition-colors group"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
								</svg>
								<div>
									<div className="font-mono font-bold text-sm">
										GitHub Issues
									</div>
									<div className="font-mono text-xs text-muted-foreground">
										Report bugs and request features
									</div>
								</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<line x1="5" y1="12" x2="19" y2="12"></line>
									<polyline points="12 5 19 12 12 19"></polyline>
								</svg>
							</a>
							<a
								href="/docs/faq"
								className="flex items-center gap-3 p-4 border border-border bg-background hover:bg-muted transition-colors group"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10"></circle>
									<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
									<line
										x1="12"
										y1="17"
										x2="12.01"
										y2="17"
									></line>
								</svg>
								<div>
									<div className="font-mono font-bold text-sm">
										FAQ
									</div>
									<div className="font-mono text-xs text-muted-foreground">
										Frequently asked questions
									</div>
								</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<line x1="5" y1="12" x2="19" y2="12"></line>
									<polyline points="12 5 19 12 12 19"></polyline>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
