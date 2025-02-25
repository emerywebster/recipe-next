import { useAuth } from '../../lib/auth';
import { ProfileForm } from '../ProfileForm';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <ProfileForm />
    </div>
  );
}
