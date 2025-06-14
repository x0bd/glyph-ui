export default function InstallationPage() {
	return (
		<article className="space-y-8">
			<header className="border-b border-border pb-6 mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="inline-block bg-foreground text-background px-3 py-1 font-mono text-xs">
						GETTING STARTED
					</div>
					<div className="h-px bg-border flex-grow"></div>
				</div>
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-sm font-bold">
						01
					</div>
					<h1 className="font-mono text-4xl font-bold tracking-tighter">
						INSTALLATION
					</h1>
				</div>
			</header>

			<section className="space-y-10">
				<div className="flex gap-4 items-start">
					<div className="w-1 h-8 bg-primary mt-1"></div>
					<p className="font-mono text-lg">
						GlyphUI is designed to work seamlessly with Vite-based
						React projects. Follow these steps to get started
						quickly.
					</p>
				</div>

				<div className="space-y-6 pl-5 border-l border-border">
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							1
						</span>
						PREREQUISITES
					</h2>
					<div className="bg-muted p-6 border border-border">
						<ul className="list-none space-y-4 font-mono">
							<li className="flex items-center gap-3">
								<div className="w-2 h-2 bg-foreground"></div>
								<span>Node.js 16.8 or later</span>
							</li>
							<li className="flex items-center gap-3">
								<div className="w-2 h-2 bg-foreground"></div>
								<span>React 18 or later</span>
							</li>
							<li className="flex items-center gap-3">
								<div className="w-2 h-2 bg-foreground"></div>
								<span>Vite project</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="space-y-6 pl-5 border-l border-border">
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							2
						</span>
						INSTALL THE PACKAGE
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Install GlyphUI using your preferred package manager:
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-muted border border-border">
							<div className="bg-foreground text-background px-3 py-1 font-mono text-xs">
								npm
							</div>
							<div className="p-4 flex items-center justify-between bg-background">
								<code className="font-mono text-sm">
									npm install glyphui
								</code>
								<button className="bg-foreground text-background px-3 py-1 text-xs hover:bg-foreground/90">
									COPY
								</button>
							</div>
						</div>

						<div className="bg-muted border border-border">
							<div className="bg-foreground text-background px-3 py-1 font-mono text-xs">
								yarn
							</div>
							<div className="p-4 flex items-center justify-between bg-background">
								<code className="font-mono text-sm">
									yarn add glyphui
								</code>
								<button className="bg-foreground text-background px-3 py-1 text-xs hover:bg-foreground/90">
									COPY
								</button>
							</div>
						</div>

						<div className="bg-muted border border-border">
							<div className="bg-foreground text-background px-3 py-1 font-mono text-xs">
								pnpm
							</div>
							<div className="p-4 flex items-center justify-between bg-background">
								<code className="font-mono text-sm">
									pnpm add glyphui
								</code>
								<button className="bg-foreground text-background px-3 py-1 text-xs hover:bg-foreground/90">
									COPY
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6 pl-5 border-l border-border">
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							3
						</span>
						IMPORT STYLES
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Import the GlyphUI styles in your main entry file:
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">main.jsx</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import 'glyphui/styles.css'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(<App />)`}</code>
							</pre>
						</div>
					</div>
				</div>

				<div className="space-y-6 pl-5 border-l border-border">
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							4
						</span>
						USE COMPONENTS
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Start using GlyphUI components in your application:
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								MyComponent.jsx
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { Button, Card, Input } from 'glyphui'

function MyComponent() {
	return (
		<Card>
			<h2>Sign Up</h2>
			<Input placeholder="Email" />
			<Button>Submit</Button>
		</Card>
	)
}`}</code>
							</pre>
						</div>
					</div>

					<div className="bg-muted p-4 border border-border mt-8">
						<div className="flex gap-3 items-start">
							<div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
								!
							</div>
							<div>
								<h3 className="font-mono text-sm font-bold mb-2">
									NOTE
								</h3>
								<p className="font-mono text-xs text-muted-foreground">
									For TypeScript users, GlyphUI includes
									built-in type definitions. No need to
									install additional packages.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="flex justify-between items-center pt-8 mt-12 border-t border-border font-mono">
				<div></div>
				<a
					href="/docs/getting-started"
					className="inline-flex items-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90 group"
				>
					NEXT: GETTING STARTED
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
						className="ml-2 transform group-hover:translate-x-1 transition-transform"
					>
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</a>
			</div>
		</article>
	);
}
