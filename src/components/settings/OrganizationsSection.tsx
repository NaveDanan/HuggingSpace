import React from 'react';
import { FormField } from '../ui/FormField';
import { Building2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface OrganizationsSectionProps {
  organizations: Organization[];
  onChange: (orgs: Organization[]) => void;
}

export function OrganizationsSection({ organizations = [], onChange }: OrganizationsSectionProps) {
  const addOrganization = () => {
    onChange([...organizations, { id: crypto.randomUUID(), name: '', role: '' }]);
  };

  const removeOrganization = (id: string) => {
    onChange(organizations.filter(org => org.id !== id));
  };

  const updateOrganization = (id: string, field: keyof Organization, value: string) => {
    onChange(organizations.map(org => 
      org.id === id ? { ...org, [field]: value.trim() } : org
    ));
  };

  return (
    <FormField 
      label="Organizations" 
      tooltip="Add organizations you're affiliated with"
    >
      <div className="space-y-4">
        {organizations.map(org => (
          <div key={org.id} className="flex gap-4">
            <input
              type="text"
              value={org.name}
              onChange={(e) => updateOrganization(org.id, 'name', e.target.value)}
              placeholder="Organization name"
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-white rounded-lg px-4 py-2
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <input
              type="text"
              value={org.role}
              onChange={(e) => updateOrganization(org.id, 'role', e.target.value)}
              placeholder="Your role"
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-white rounded-lg px-4 py-2
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => removeOrganization(org.id)}
              className="px-3 py-2 text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addOrganization}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          <Building2 className="w-4 h-4" />
          Add Organization
        </button>
      </div>
    </FormField>
  );
}