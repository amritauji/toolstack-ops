import MonitoringClient from './MonitoringClient';

export const metadata = {
  title: 'System Monitoring | NexBoard',
  description: 'System health and performance monitoring'
};

export default function MonitoringPage() {
  return <MonitoringClient />;
}
