'use client';

import { useState } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';
import CommonTable, { Column } from '@/components/tables/CommonTable';

interface Location {
  id: number;
  name: string;
  address: string;
  region: string;
  vendor: string;
}
export default function LocationPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Implementasi delete disini
    console.log('Deleting location:', selectedLocation);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmEdit = () => {
    // Implementasi edit disini
    console.log('Editing location:', selectedLocation);
    setIsEditModalOpen(false);
  };

  const handleExport = () => {
    // Implementasi export data ke CSV/Excel
    console.log('Exporting data...');
  };

  // Tambahkan state untuk data lokasi
  const [locations] = useState<Location[]>([
    {
      id: 1,
      name: "Terminal 1A",
      address: "Jl. Terminal 1A No. 1",
      region: "Jakarta Barat",
      vendor: "PT ABC"
    }
  ]);

  const columns: Column<Location>[] = [
    { 
      header: 'No', 
      accessor: 'id',
    },
    { header: 'Name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
    { header: 'Region', accessor: 'region' },
    { header: 'Vendor', accessor: 'vendor' },
    {
      header: 'Aksi',
      accessor: 'id',
      render: (_: Location[keyof Location], location: Location) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(location)}
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={() => handleDelete(location)}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLocation, ] = useState<Partial<Location>>({});

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleConfirmAdd = () => {
    // Implementasi add disini
    console.log('Adding new location:', newLocation);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Export Data</span>
                </button>
                <button 
                  onClick={handleAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Tambah Lokasi</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
              <CommonTable 
                data={locations} 
                columns={columns}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus lokasi ${selectedLocation?.name}?`}
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
      />

      {/* Modal Konfirmasi Edit */}
      <ConfirmationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Konfirmasi Edit"
        message={`Anda akan mengubah data lokasi ${selectedLocation?.name}`}
        confirmText="Edit"
        cancelText="Batal"
        type="edit"
      />

      {/* Modal Tambah Lokasi */}
      <ConfirmationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleConfirmAdd}
        title="Tambah Lokasi"
        message="Apakah Anda yakin ingin menambah lokasi baru?"
        confirmText="Tambah"
        cancelText="Batal"
        type="edit"
      />
    </div>
  );
}