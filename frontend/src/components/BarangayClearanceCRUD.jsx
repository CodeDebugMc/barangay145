import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, Eye, Users, FileText } from 'lucide-react';

export default function BarangayClearanceCRUD() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('form');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    birthday: '',
    age: '',
    provincialAddress: '',
    contactNo: '',
    civilStatus: 'Single',
    requestReason: '',
    dateIssued: new Date().toISOString().split('T')[0]
  });

  const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Divorced', 'Separated'];

  const apiBase = 'http://localhost:5000';

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await fetch(`${apiBase}/request-records`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              id: r.id,
              name: r.name,
              address: r.address,
              birthday: r.birthday?.slice(0, 10) || '',
              age: String(r.age ?? ''),
              provincialAddress: r.provincial_address || '',
              contactNo: r.contact_no || '',
              civilStatus: r.civil_status,
              requestReason: r.request_reason,
              dateIssued: r.date_issued?.slice(0, 10) || '',
              dateCreated: r.date_created
            }))
          : []
      );
    } catch (e) {
      console.error('Failed to load records', e);
    }
  };

  const handleBirthdayChange = (birthday) => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      setFormData({ ...formData, birthday, age: age.toString() });
    } else {
      setFormData({ ...formData, birthday, age: '' });
    }
  };

  const toServerPayload = (data) => ({
    name: data.name,
    address: data.address,
    birthday: data.birthday || null,
    age: data.age ? Number(data.age) : null,
    provincial_address: data.provincialAddress || null,
    contact_no: data.contactNo || null,
    civil_status: data.civilStatus,
    request_reason: data.requestReason,
    date_issued: data.dateIssued
  });

  const handleCreate = async () => {
    try {
      const res = await fetch(`${apiBase}/request-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData))
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      const newRecord = {
        ...formData,
        id: created.id,
        dateCreated: created.date_created || new Date().toISOString()
      };
      setRecords([newRecord, ...records]);
      setSelectedRecord(newRecord);
      resetForm();
      setActiveTab('form');
    } catch (e) {
      console.error(e);
      alert('Failed to create record');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${apiBase}/request-records/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData))
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = { ...formData, id: editingId };
      setRecords(records.map((r) => (r.id === editingId ? updated : r)));
      setSelectedRecord(updated);
      resetForm();
      setActiveTab('form');
    } catch (e) {
      console.error(e);
      alert('Failed to update record');
    }
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setEditingId(record.id);
    setIsFormOpen(true);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${apiBase}/request-records/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRecords(records.filter((r) => r.id !== id));
      if (selectedRecord && selectedRecord.id === id) setSelectedRecord(null);
    } catch (e) {
      console.error(e);
      alert('Failed to delete record');
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setActiveTab('form');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      birthday: '',
      age: '',
      provincialAddress: '',
      contactNo: '',
      civilStatus: 'Single',
      requestReason: '',
      dateIssued: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = () => {
    if (editingId) handleUpdate();
    else handleCreate();
  };

  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.contactNo || '').includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 p-4 overflow-auto">
        <div
          style={{
            margin: 0,
            padding: 0,
            background: '#f2f2f2',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '8.5in',
              height: '11in',
              margin: '20px auto',
              boxShadow: '0 0 8px rgba(0,0,0,0.2)',
              background: '#fff'
            }}
          >
            <div style={{ position: 'absolute', width: '80px', height: '80px', top: '60px', left: '40px', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '8px' }}>
              Caloocan Logo
            </div>
            <div style={{ position: 'absolute', width: '80px', height: '80px', top: '60px', left: '130px', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '8px' }}>
              Bagong Pilipinas
            </div>
            <div style={{ position: 'absolute', width: '100px', height: '100px', top: '50px', right: '40px', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '8px' }}>
              Logo 145
            </div>

            <div
              style={{
                position: 'absolute',
                opacity: 0.1,
                width: '400px',
                height: '400px',
                left: '50%',
                top: '250px',
                transform: 'translateX(-50%)',
                backgroundColor: '#e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                borderRadius: '50%'
              }}
            >
              Watermark
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                textAlign: 'center',
                width: '100%',
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: '"Lucida Calligraphy", cursive',
                top: '50px'
              }}
            >
              Republic of the Philippines
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                textAlign: 'center',
                width: '100%',
                fontSize: '13pt',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                top: '84px'
              }}
            >
              CITY OF CALOOCAN
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                textAlign: 'center',
                width: '100%',
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: '"Arial Black", sans-serif',
                top: '110px'
              }}
            >
              BARANGAY 145 ZONES 13 DIST. 1
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                textAlign: 'center',
                width: '100%',
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: '"Arial Black", sans-serif',
                top: '138px'
              }}
            >
              Tel. No. 8711 - 7134
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                textAlign: 'center',
                width: '100%',
                fontSize: '19px',
                fontWeight: 'bold',
                fontFamily: '"Arial Black", sans-serif',
                top: '166px'
              }}
            >
              OFFICE OF THE BARANGAY CHAIRMAN
            </div>

            <div
              style={{
                position: 'absolute',
                top: '220px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <span
                style={{
                  fontFamily: '"Brush Script MT", cursive',
                  fontSize: '30px',
                  fontWeight: 'normal',
                  display: 'inline-block',
                  background: '#0b7030',
                  color: '#fff',
                  padding: '4px 70px',
                  borderRadius: '8px'
                }}
              >
                Certificate of Indigency
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                top: '320px',
                right: '60px',
                fontFamily: '"Times New Roman", serif',
                fontSize: '12pt',
                fontWeight: 'bold',
                color: 'red'
              }}
            >
              Date: {selectedRecord ? formatDate(selectedRecord.dateIssued) : '_________________'}
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                top: '370px',
                left: '80px',
                width: '640px',
                textAlign: 'justify',
                fontFamily: '"Times New Roman", serif',
                fontSize: '12pt',
                fontWeight: 'bold',
                color: 'black'
              }}
            >
              To whom it may concern:<br />
              <span style={{ marginLeft: '50px' }}></span>This is to certify that the person whose name and thumb print
              appear<br /> here on has requested a Barangay Clearance from this office
              and the result/s<br />  is/are listed below and valid for six (6) months only.
            </div>

            <div
              style={{
                position: 'absolute',
                whiteSpace: 'pre',
                top: '470px',
                left: '80px',
                width: '640px',
                lineHeight: '1.8',
                fontFamily: '"Times New Roman", serif',
                fontSize: '12pt',
                fontWeight: 'bold'
              }}
            >
              <div>
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Name:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.name : '_________________________________'}
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Address:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.address : '_______________________________'}
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Birthday:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? formatDate(selectedRecord.birthday) : '______________'}
                </span>
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', marginLeft: '180px' }}>Age:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.age : '____'}
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Provincial Address:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.provincialAddress : '______________'}
                </span>
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', marginLeft: '100px' }}>Contact No.:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.contactNo : '_____________'}
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Civil Status:</span>
                <span style={{ color: 'black', marginLeft: '10px' }}>
                  {selectedRecord ? selectedRecord.civilStatus : '_________________'}
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>Remarks:</span><br />
                <span style={{ color: 'black', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>
                  Residence in this Barangay, no derogatory record
                </span><br />
                
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily: '"Times New Roman", serif' }}>
                  This certification is being issued upon request for{' '}
                </span>
                <span style={{ color: 'black' }}>
                  {selectedRecord ? selectedRecord.requestReason : '_______________'}
                </span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '750px',
                left: '50px',
                width: '250px',
                textAlign: 'center',
                fontFamily: '"Times New Roman", serif',
                fontSize: '12pt',
                fontWeight: 'bold'
              }}
            >
              <div style={{ borderTop: '2px solid #000', width: '65%', margin: 'auto' }}></div>
              <div style={{ color: 'black', fontFamily: 'inherit' }}>Applicant's Signature</div>
              <div
                style={{
                  margin: '15px auto 0 auto',
                  width: '150px',
                  height: '75px',
                  border: '1px solid #000'
                }}
              ></div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '900px',
                right: '100px',
                width: '300px',
                textAlign: 'center'
              }}
            >
              <div style={{ borderTop: '2.5px solid #000', width: '90%', margin: 'auto' }}></div>
              <div
                style={{
                  fontFamily: 'Impact, sans-serif',
                  fontSize: '25pt',
                  fontWeight: 'bold',
                  backgroundImage: 'linear-gradient(to bottom, orange 50%, yellow 20%, orange 70%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitTextStroke: '1px black',
                  display: 'inline-block'
                }}
              >
                Arnold Dondonayos
              </div>
              <div
                style={{
                  fontFamily: '"Brush Script MT", cursive',
                  fontSize: '20pt',
                  color: '#000',
                  marginTop: '-8px',
                  fontWeight: 'bold'
                }}
              >
                Punong Barangay
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'form'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Form
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'records'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Records ({records.length})
          </button>
        </div>

        {activeTab === 'form' && (
          <div className="flex-1 p-4 overflow-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {editingId ? 'Edit Record' : 'New Clearance Record'}
              </h2>
              {selectedRecord && !editingId && (
                <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                  Viewing: {selectedRecord.name}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birthday *
                  </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleBirthdayChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincial Address
                </label>
                <input
                  type="text"
                  value={formData.provincialAddress}
                  onChange={(e) => setFormData({ ...formData, provincialAddress: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="09XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Civil Status *
                </label>
                <select
                  value={formData.civilStatus}
                  onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  {civilStatusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Reason *
                </label>
                <textarea
                  value={formData.requestReason}
                  onChange={(e) => setFormData({ ...formData, requestReason: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows="2"
                  placeholder="Job application, School enrollment, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Issued *
                </label>
                <input
                  type="date"
                  value={formData.dateIssued}
                  onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Save'}
                </button>
                {(editingId || isFormOpen) && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Search records..."
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {filteredRecords.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No records found' : 'No records yet'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {record.name}
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleView(record)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{record.address}</p>
                      <p className="text-xs text-gray-500">
                        {record.contactNo} • {record.civilStatus}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Issued: {formatDate(record.dateIssued)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



