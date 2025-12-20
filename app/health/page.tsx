import HealthTracking from '@/components/HealthTracking';
import Navigation from '@/components/Navigation';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HealthTracking />
    </div>
  );
}

