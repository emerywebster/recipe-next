import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AuthDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { signIn, signUp } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (isSignUp) {
				await signUp(email, password);
				toast({
					title: 'Account created',
					description: 'Please check your email to verify your account.',
				});
			} else {
				await signIn(email, password);
				onOpenChange(false);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'An error occurred',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle>{isSignUp ? 'Create account' : 'Sign in'}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type="submit" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isSignUp ? 'Creating account...' : 'Signing in...'}
							</>
						) : (
							<>{isSignUp ? 'Sign up' : 'Sign in'}</>
						)}
					</Button>
					<Button type="button" variant="link" className="mt-2" onClick={() => setIsSignUp(!isSignUp)}>
						{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
