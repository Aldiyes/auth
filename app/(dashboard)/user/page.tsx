import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';

export default async function UserPage() {
	return (
		<div>
			<Button onClick={await logout}>Logout</Button>
			User Page
		</div>
	);
}
