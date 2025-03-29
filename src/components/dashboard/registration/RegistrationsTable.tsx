import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Mail, CheckSquare, ClipboardList, Users, CheckCircle, XCircle } from 'lucide-react';
import { Registration } from '@/types';
import { formatDate } from '@/lib/utils';
import TablePagination from './TablePagination';
import BulkActionBar from './BulkActionBar';

interface RegistrationsTableProps {
  filteredRegistrations: Registration[];
  selectedRegistrations: string[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalRegistrations: number;
  bulkActions: {
    sendEmailToSelected: () => void;
    markAsCheckedIn: () => Promise<void>;
    generateTicketsForSelected: () => Promise<void>;
  };
  selectionHandlers: {
    toggleSelectRegistration: (id: string) => void;
    toggleSelectAll: () => void;
  };
}

export default function RegistrationsTable({
  filteredRegistrations,
  selectedRegistrations,
  page,
  setPage,
  totalPages,
  totalRegistrations,
  bulkActions,
  selectionHandlers
}: RegistrationsTableProps) {
  // Statut de badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmée</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'completed':
        return <Badge variant="default">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      {selectedRegistrations.length > 0 && (
        <BulkActionBar 
          selectedCount={selectedRegistrations.length}
          onSendEmail={bulkActions.sendEmailToSelected}
          onMarkAsCheckedIn={bulkActions.markAsCheckedIn}
          onGenerateTickets={bulkActions.generateTicketsForSelected}
        />
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={
                      filteredRegistrations.length > 0 &&
                      selectedRegistrations.length === filteredRegistrations.length
                    }
                    onChange={selectionHandlers.toggleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Présence
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.length === 0 ? (
              <EmptyState />
            ) : (
              filteredRegistrations.map((registration) => (
                <RegistrationRow 
                  key={registration.id} 
                  registration={registration}
                  isSelected={selectedRegistrations.includes(registration.id)}
                  onToggleSelect={() => selectionHandlers.toggleSelectRegistration(registration.id)}
                  getStatusBadge={getStatusBadge}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
          totalItems={totalRegistrations} 
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
        <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
        <p className="text-lg font-medium">Aucune inscription trouvée</p>
        <p className="text-sm mt-1">
          Essayez de modifier vos critères de recherche.
        </p>
      </td>
    </tr>
  );
}

interface RegistrationRowProps {
  registration: Registration;
  isSelected: boolean;
  onToggleSelect: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

function RegistrationRow({ registration, isSelected, onToggleSelect, getStatusBadge }: RegistrationRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary focus:ring-primary"
            checked={isSelected}
            onChange={onToggleSelect}
          />
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {registration.reference_code}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {registration.userInfo?.first_name} {registration.userInfo?.last_name}
        </div>
        <div className="text-sm text-gray-500">{registration.userInfo?.email}</div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {registration.event_detail?.title || 'Événement inconnu'}
        </div>
        <div className="text-xs text-gray-500">
          {registration.registration_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(registration.created_at)}</div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        {getStatusBadge(registration.status)}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        {registration.is_checked_in ? (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Présent
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center">
            <XCircle className="h-3 w-3 mr-1" /> Non présent
          </Badge>
        )}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <Link 
            href={`/dashboard/registrations/${registration.id}`} 
            className="text-primary hover:text-primary-dark"
          >
            Détails
          </Link>
        </div>
      </td>
    </tr>
  );
}