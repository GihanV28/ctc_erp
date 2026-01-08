'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { Package, MapPin, Calendar, Plus, Loader2 } from 'lucide-react';
import { CreateShipmentData, shipmentService } from '@/services/shipmentService';

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateShipmentData) => void;
}

interface NewShipmentFormData {
  client: string;
  container: string;
  originPort: string;
  originCity: string;
  originCountry: string;
  destinationPort: string;
  destinationCity: string;
  destinationCountry: string;
  departureDate: string;
  estimatedArrival: string;
  cargoDescription: string;
  cargoWeight: number;
  cargoVolume: number;
  cargoQuantity: number;
  totalCost: number;
  currency: string;
  notes: string;
}

const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NewShipmentFormData>({
    client: '',
    container: '',
    originPort: '',
    originCity: '',
    originCountry: '',
    destinationPort: '',
    destinationCity: '',
    destinationCountry: '',
    departureDate: '',
    estimatedArrival: '',
    cargoDescription: '',
    cargoWeight: 0,
    cargoVolume: 0,
    cargoQuantity: 0,
    totalCost: 0,
    currency: 'USD',
    notes: '',
  });

  const [clients, setClients] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewShipmentFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [clientsData, containersData] = await Promise.all([
        shipmentService.getActiveClients(),
        shipmentService.getAvailableContainers(),
      ]);
      setClients(clientsData);
      setContainers(containersData);
    } catch (error: any) {
      console.error('Failed to load dropdown data:', error);
      alert('Failed to load clients and containers: ' + error.message);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['cargoWeight', 'cargoVolume', 'cargoQuantity', 'totalCost'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));

    if (errors[name as keyof NewShipmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewShipmentFormData, string>> = {};

    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.container) newErrors.container = 'Container is required';
    if (!formData.originPort.trim()) newErrors.originPort = 'Origin port is required';
    if (!formData.originCountry.trim()) newErrors.originCountry = 'Origin country is required';
    if (!formData.destinationPort.trim()) newErrors.destinationPort = 'Destination port is required';
    if (!formData.destinationCountry.trim()) newErrors.destinationCountry = 'Destination country is required';
    if (!formData.cargoDescription.trim()) newErrors.cargoDescription = 'Cargo description is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.estimatedArrival) newErrors.estimatedArrival = 'Estimated arrival is required';

    // Validate dates
    if (formData.departureDate && formData.estimatedArrival) {
      const departure = new Date(formData.departureDate);
      const arrival = new Date(formData.estimatedArrival);
      if (arrival <= departure) {
        newErrors.estimatedArrival = 'Arrival date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const submitData: CreateShipmentData = {
      client: formData.client,
      origin: {
        port: formData.originPort,
        city: formData.originCity || undefined,
        country: formData.originCountry,
      },
      destination: {
        port: formData.destinationPort,
        city: formData.destinationCity || undefined,
        country: formData.destinationCountry,
      },
      cargo: {
        description: formData.cargoDescription,
        weight: formData.cargoWeight || undefined,
        volume: formData.cargoVolume || undefined,
        quantity: formData.cargoQuantity || undefined,
      },
      dates: {
        departureDate: formData.departureDate,
        estimatedArrival: formData.estimatedArrival,
      },
      totalCost: formData.totalCost || undefined,
      currency: formData.currency,
      notes: formData.notes || undefined,
    };

    try {
      await onSubmit(submitData);
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        client: '',
        container: '',
        originPort: '',
        originCity: '',
        originCountry: '',
        destinationPort: '',
        destinationCity: '',
        destinationCountry: '',
        departureDate: '',
        estimatedArrival: '',
        cargoDescription: '',
        cargoWeight: 0,
        cargoVolume: 0,
        cargoQuantity: 0,
        totalCost: 0,
        currency: 'USD',
        notes: '',
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      description="Enter the details for the new shipment"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {loadingDropdowns && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <p className="text-sm text-purple-700">Loading clients and containers...</p>
          </div>
        )}

        {/* Client and Container */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              disabled={loadingDropdowns}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.client
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
              } focus:ring-2 focus:outline-none transition-all`}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.companyName} ({client.clientId})
                </option>
              ))}
            </select>
            {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Container <span className="text-red-500">*</span>
            </label>
            <select
              name="container"
              value={formData.container}
              onChange={handleChange}
              disabled={loadingDropdowns}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.container
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
              } focus:ring-2 focus:outline-none transition-all`}
            >
              <option value="">Select container</option>
              {containers.map((container) => (
                <option key={container._id} value={container._id}>
                  {container.containerNumber} - {container.type} ({container.condition})
                </option>
              ))}
            </select>
            {errors.container && <p className="mt-1 text-sm text-red-500">{errors.container}</p>}
          </div>
        </div>

        {/* Origin */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            Origin
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Port *"
              name="originPort"
              placeholder="e.g., Shanghai, China"
              value={formData.originPort}
              onChange={handleChange}
              error={errors.originPort}
            />
            <Input
              label="City"
              name="originCity"
              placeholder="e.g., Shanghai"
              value={formData.originCity}
              onChange={handleChange}
            />
            <Input
              label="Country *"
              name="originCountry"
              placeholder="e.g., China"
              value={formData.originCountry}
              onChange={handleChange}
              error={errors.originCountry}
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            Destination
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Port *"
              name="destinationPort"
              placeholder="e.g., Los Angeles, USA"
              value={formData.destinationPort}
              onChange={handleChange}
              error={errors.destinationPort}
            />
            <Input
              label="City"
              name="destinationCity"
              placeholder="e.g., Los Angeles"
              value={formData.destinationCity}
              onChange={handleChange}
            />
            <Input
              label="Country *"
              name="destinationCountry"
              placeholder="e.g., USA"
              value={formData.destinationCountry}
              onChange={handleChange}
              error={errors.destinationCountry}
            />
          </div>
        </div>

        {/* Dates */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Schedule
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Departure Date *"
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              error={errors.departureDate}
            />
            <Input
              label="Estimated Arrival *"
              type="date"
              name="estimatedArrival"
              value={formData.estimatedArrival}
              onChange={handleChange}
              error={errors.estimatedArrival}
            />
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Cargo Details
          </h4>
          <div className="space-y-4">
            <Input
              label="Description *"
              name="cargoDescription"
              placeholder="e.g., Electronics, Machinery"
              value={formData.cargoDescription}
              onChange={handleChange}
              error={errors.cargoDescription}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                name="cargoWeight"
                placeholder="0"
                value={formData.cargoWeight || ''}
                onChange={handleChange}
              />
              <Input
                label="Volume (m³)"
                type="number"
                name="cargoVolume"
                placeholder="0"
                value={formData.cargoVolume || ''}
                onChange={handleChange}
              />
              <Input
                label="Quantity"
                type="number"
                name="cargoQuantity"
                placeholder="0"
                value={formData.cargoQuantity || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Financial */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Financial Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Cost"
              type="number"
              name="totalCost"
              placeholder="0"
              value={formData.totalCost || ''}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="LKR">LKR</option>
                <option value="INR">INR</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Shipment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewShipmentModal;
