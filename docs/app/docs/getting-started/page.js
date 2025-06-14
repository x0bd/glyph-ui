export default function GettingStartedPage() {
	return (
		<article className="space-y-8">
			<header className="border-b border-border pb-6 mb-8">
				<div className="inline-block bg-foreground text-background px-3 py-1 font-mono text-xs mb-4">
					GETTING STARTED
				</div>
				<h1 className="font-mono text-4xl font-bold tracking-tighter">
					GETTING STARTED
				</h1>
			</header>

			<section className="space-y-6">
				<p className="font-mono">
					This guide will help you start building interfaces with
					GlyphUI. We'll cover the basics of using components and
					creating your first UI.
				</p>

				<div className="space-y-6">
					<h2 className="font-mono text-2xl font-bold tracking-tighter">
						BASIC USAGE
					</h2>
					<p className="font-mono">
						After{" "}
						<a
							href="/docs/installation"
							className="underline underline-offset-4"
						>
							installing GlyphUI
						</a>
						, you can start using components in your application.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-mono text-2xl font-bold tracking-tighter">
						CREATING A SIMPLE FORM
					</h2>
					<p className="font-mono text-sm">
						Let's create a simple login form using GlyphUI
						components:
					</p>

					<div className="bg-muted border border-border p-4 font-mono">
						<div className="bg-background border border-border p-3">
							<pre className="text-sm overflow-x-auto">
								<code>{`import { useState } from 'react'
import { 
  Button, 
  Card, 
  Input, 
  Label, 
  Stack 
} from 'glyphui'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, password })
    // Handle login logic here
  }
  
  return (
    <Card className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <h2 className="text-2xl font-bold">Login</h2>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </Stack>
      </form>
    </Card>
  )
}`}</code>
							</pre>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="font-mono text-2xl font-bold tracking-tighter">
						COMPONENT COMPOSITION
					</h2>
					<p className="font-mono text-sm">
						GlyphUI components are designed to work together. Here's
						an example of component composition:
					</p>

					<div className="bg-muted border border-border p-4 font-mono">
						<div className="bg-background border border-border p-3">
							<pre className="text-sm overflow-x-auto">
								<code>{`import { 
  Button, 
  Card, 
  Heading, 
  Text, 
  Stack, 
  Divider 
} from 'glyphui'

function PricingCard({ tier, price, features, popular }) {
  return (
    <Card 
      className={\`p-6 \${popular ? 'border-primary' : ''}\`}
    >
      <Stack gap="4">
        <Heading level="3">{tier}</Heading>
        <div>
          <Text className="text-3xl font-bold">${price}</Text>
          <Text>/month</Text>
        </div>
        
        <Divider />
        
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon /> {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          variant={popular ? "primary" : "outline"}
          className="w-full"
        >
          Get Started
        </Button>
      </Stack>
    </Card>
  )
}`}</code>
							</pre>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="font-mono text-2xl font-bold tracking-tighter">
						STYLING COMPONENTS
					</h2>
					<p className="font-mono text-sm">
						GlyphUI components accept className props for custom
						styling with Tailwind CSS:
					</p>

					<div className="bg-muted border border-border p-4 font-mono">
						<div className="bg-background border border-border p-3">
							<pre className="text-sm overflow-x-auto">
								<code>{`import { Button } from 'glyphui'

function CustomButtons() {
  return (
    <div className="space-y-4">
      {/* Default styling */}
      <Button>Default Button</Button>
      
      {/* Custom styling */}
      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
        Custom Purple
      </Button>
      
      {/* Full width on mobile, auto width on larger screens */}
      <Button className="w-full sm:w-auto">
        Responsive Button
      </Button>
    </div>
  )
}`}</code>
							</pre>
						</div>
					</div>
				</div>
			</section>

			<div className="flex justify-between items-center pt-8 mt-12 border-t border-border font-mono">
				<a
					href="/docs/installation"
					className="inline-flex items-center border border-border px-4 py-2 hover:bg-muted"
				>
					← PREV: INSTALLATION
				</a>
				<a
					href="/docs/components/button"
					className="inline-flex items-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90"
				>
					NEXT: BUTTON COMPONENT →
				</a>
			</div>
		</article>
	);
}
