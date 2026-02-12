import { getApiKeys } from '@/lib/apiKeys';
import ApiKeysClient from './ApiKeysClient';

export const metadata = {
  title: 'API Keys | NexBoard',
  description: 'Manage your API keys'
};

export default async function ApiKeysPage() {
  const keys = await getApiKeys();
  
  return <ApiKeysClient initialKeys={keys} />;
}
