import Image from "next/image";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/* Header */}
			<header className="border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
				<div className="font-mono text-xl font-bold tracking-tighter">
					GLYPH/UI
				</div>
				<nav className="hidden md:flex space-x-8">
					<a
						href="/docs"
						className="font-mono text-sm hover:text-primary transition-colors"
					>
						DOCS
					</a>
					<a
						href="/components"
						className="font-mono text-sm hover:text-primary transition-colors"
					>
						COMPONENTS
					</a>
					<a
						href="/hooks"
						className="font-mono text-sm hover:text-primary transition-colors"
					>
						HOOKS
					</a>
					<a
						href="https://github.com/your-username/glyph-ui"
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-sm hover:text-primary transition-colors"
					>
						GITHUB
					</a>
				</nav>
				<button className="md:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</button>
			</header>

			{/* Hero */}
			<section className="border-b border-border relative overflow-hidden">
				<div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5">
					{Array.from({ length: 36 }).map((_, i) => (
						<div key={i} className="border border-border"></div>
					))}
				</div>
				<div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 md:py-24 px-6">
					<div className="space-y-6 relative">
						<div className="inline-block bg-foreground text-background px-3 py-1 font-mono text-sm">
							BETA
						</div>
						<h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter leading-tight">
							MINIMAL UI
							<br />
							MAXIMUM
							<br />
							IMPACT
						</h1>
						<p className="font-mono text-muted-foreground max-w-md">
							A brutalist component library for React
							applications. No bloat. Just pure design.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<a
								href="/docs/getting-started"
								className="bg-foreground text-background hover:bg-foreground/90 font-mono px-6 py-3 inline-flex items-center justify-center"
							>
								GET STARTED →
							</a>
							<a
								href="/docs/installation"
								className="border border-border hover:bg-muted font-mono px-6 py-3 inline-flex items-center justify-center"
							>
								INSTALLATION
							</a>
						</div>
					</div>
					<div className="relative h-[400px] bg-muted border border-border grid place-items-center overflow-hidden">
						<div className="font-mono text-6xl font-bold tracking-tighter text-border/20 absolute -rotate-12">
							GLYPH/UI
						</div>
						<div className="z-10 p-6 bg-background border border-border shadow-lg">
							<div className="flex items-center gap-2 border-b border-border pb-2 mb-3">
								<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
								<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
								<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
							</div>
							<pre className="font-mono text-sm">
								<code className="text-primary">{`import { Button } from 'glyphui'

function App() {
	return (
		<Button variant="primary">
			CLICK ME
		</Button>
	)
}`}</code>
							</pre>
						</div>
					</div>
				</div>
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
					<div className="w-12 h-1 bg-foreground/30"></div>
					<div className="w-12 h-1 bg-foreground"></div>
					<div className="w-12 h-1 bg-foreground/30"></div>
				</div>
			</section>

			{/* Features */}
			<section className="py-16 md:py-20 px-6 bg-background relative">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center gap-4 mb-12">
						<div className="h-px bg-border flex-grow"></div>
						<h2 className="font-mono text-3xl font-bold tracking-tighter text-center">
							FEATURES
						</h2>
						<div className="h-px bg-border flex-grow"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-1">
						<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative group">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
							<h3 className="font-mono text-xl font-bold mb-4 flex items-center">
								<span className="inline-block w-6 h-6 bg-foreground text-background flex items-center justify-center mr-2 text-xs">
									A
								</span>
								ACCESSIBLE
							</h3>
							<p className="font-mono text-muted-foreground text-sm">
								Components follow WAI-ARIA standards for maximum
								accessibility. Every component is keyboard
								navigable.
							</p>
							<ul className="mt-4 space-y-2 font-mono text-xs">
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									ARIA attributes
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Keyboard navigation
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Focus management
								</li>
							</ul>
						</div>
						<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative group">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
							<h3 className="font-mono text-xl font-bold mb-4 flex items-center">
								<span className="inline-block w-6 h-6 bg-foreground text-background flex items-center justify-center mr-2 text-xs">
									M
								</span>
								MINIMAL
							</h3>
							<p className="font-mono text-muted-foreground text-sm">
								Clean design with no unnecessary styling or
								dependencies. Focus on what matters.
							</p>
							<ul className="mt-4 space-y-2 font-mono text-xs">
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Zero dependencies
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Small bundle size
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Brutalist design
								</li>
							</ul>
						</div>
						<div className="border border-border p-6 bg-background hover:bg-muted transition-colors relative group">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
							<h3 className="font-mono text-xl font-bold mb-4 flex items-center">
								<span className="inline-block w-6 h-6 bg-foreground text-background flex items-center justify-center mr-2 text-xs">
									C
								</span>
								CUSTOMIZABLE
							</h3>
							<p className="font-mono text-muted-foreground text-sm">
								Easily adapt components to match your project's
								design system. Make it yours.
							</p>
							<ul className="mt-4 space-y-2 font-mono text-xs">
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Tailwind compatible
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Simple theming
								</li>
								<li className="flex items-center gap-2">
									<span className="w-1 h-1 bg-foreground"></span>
									Extensible API
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Installation */}
			<section className="py-16 md:py-20 px-6 bg-muted border-y border-border">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center gap-4 mb-8">
						<div className="h-px bg-border flex-grow"></div>
						<h2 className="font-mono text-3xl font-bold tracking-tighter text-center whitespace-nowrap">
							QUICK START
						</h2>
						<div className="h-px bg-border flex-grow"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 font-mono font-bold">
								1
							</div>
							<h3 className="font-mono text-lg font-bold mb-2">
								INSTALL
							</h3>
							<p className="font-mono text-sm text-muted-foreground">
								Add GlyphUI to your React project
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 font-mono font-bold">
								2
							</div>
							<h3 className="font-mono text-lg font-bold mb-2">
								IMPORT
							</h3>
							<p className="font-mono text-sm text-muted-foreground">
								Include components in your app
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 font-mono font-bold">
								3
							</div>
							<h3 className="font-mono text-lg font-bold mb-2">
								BUILD
							</h3>
							<p className="font-mono text-sm text-muted-foreground">
								Create beautiful interfaces
							</p>
						</div>
					</div>
					<div className="bg-background border border-border p-4 font-mono relative">
						<div className="absolute -top-3 left-4 bg-muted px-2 text-xs font-mono text-muted-foreground">
							INSTALLATION
						</div>
						<div className="flex items-center justify-between bg-background p-3">
							<code className="text-sm">npm i glyphui</code>
							<button className="bg-foreground text-background px-3 py-1 text-xs hover:bg-foreground/90">
								COPY
							</button>
						</div>
					</div>
					<div className="flex justify-center mt-8">
						<a
							href="/docs/installation"
							className="font-mono text-sm flex items-center gap-2 hover:text-primary transition-colors"
						>
							VIEW FULL INSTALLATION GUIDE
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
							>
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12 5 19 12 12 19"></polyline>
							</svg>
						</a>
					</div>
				</div>
			</section>

			{/* Components Preview */}
			<section className="py-16 md:py-20 px-6 bg-background">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center gap-4 mb-12">
						<div className="h-px bg-border flex-grow"></div>
						<h2 className="font-mono text-3xl font-bold tracking-tighter text-center">
							COMPONENTS
						</h2>
						<div className="h-px bg-border flex-grow"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="border border-border overflow-hidden">
							<div className="bg-muted p-3 border-b border-border font-mono text-sm flex items-center justify-between">
								<span>Button.jsx</span>
								<div className="flex gap-2">
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
								</div>
							</div>
							<div className="p-6 grid grid-cols-2 gap-4">
								<div className="flex flex-col items-center gap-4">
									<div className="bg-foreground text-background font-mono text-sm py-2 px-4 w-full text-center">
										PRIMARY
									</div>
									<div className="border border-border font-mono text-sm py-2 px-4 w-full text-center">
										SECONDARY
									</div>
								</div>
								<div className="flex flex-col items-center gap-4">
									<div className="bg-foreground/10 font-mono text-sm py-2 px-4 w-full text-center">
										GHOST
									</div>
									<div className="bg-foreground text-background font-mono text-sm py-2 px-4 w-full text-center opacity-50">
										DISABLED
									</div>
								</div>
							</div>
						</div>
						<div className="border border-border overflow-hidden">
							<div className="bg-muted p-3 border-b border-border font-mono text-sm flex items-center justify-between">
								<span>Card.jsx</span>
								<div className="flex gap-2">
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
									<div className="w-3 h-3 rounded-full bg-foreground/20"></div>
								</div>
							</div>
							<div className="p-6">
								<div className="border border-border p-4">
									<h3 className="font-mono font-bold mb-2">
										CARD TITLE
									</h3>
									<p className="font-mono text-sm text-muted-foreground mb-4">
										This is a card component with various
										styling options.
									</p>
									<div className="flex justify-end">
										<div className="bg-foreground text-background font-mono text-xs py-1 px-3">
											ACTION
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center mt-12">
						<a
							href="/components"
							className="bg-foreground text-background hover:bg-foreground/90 font-mono px-6 py-3 inline-flex items-center justify-center"
						>
							EXPLORE ALL COMPONENTS
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-6 border-t border-border bg-muted">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
						<div>
							<div className="font-mono text-xl font-bold tracking-tighter mb-4">
								GLYPH/UI
							</div>
							<p className="font-mono text-xs text-muted-foreground">
								A brutalist component library for React
								applications.
							</p>
						</div>
						<div>
							<h3 className="font-mono text-sm font-bold mb-4">
								DOCS
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="/docs/installation"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Installation
									</a>
								</li>
								<li>
									<a
										href="/docs/getting-started"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Getting Started
									</a>
								</li>
								<li>
									<a
										href="/docs/theming"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Theming
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-mono text-sm font-bold mb-4">
								COMPONENTS
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="/docs/components/button"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Button
									</a>
								</li>
								<li>
									<a
										href="/docs/components/input"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Input
									</a>
								</li>
								<li>
									<a
										href="/docs/components/card"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Card
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-mono text-sm font-bold mb-4">
								LINKS
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://github.com/your-username/glyph-ui"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										GitHub
									</a>
								</li>
								<li>
									<a
										href="/examples"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										Examples
									</a>
								</li>
								<li>
									<a
										href="/docs/faq"
										className="font-mono text-xs hover:text-primary transition-colors"
									>
										FAQ
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
						<div className="font-mono text-xs text-muted-foreground">
							© {new Date().getFullYear()} GLYPH/UI. All rights
							reserved.
						</div>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a
								href="#"
								className="font-mono text-xs hover:text-primary transition-colors"
							>
								Privacy
							</a>
							<a
								href="#"
								className="font-mono text-xs hover:text-primary transition-colors"
							>
								Terms
							</a>
							<a
								href="#"
								className="font-mono text-xs hover:text-primary transition-colors"
							>
								Contact
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
