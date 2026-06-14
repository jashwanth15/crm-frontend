import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { ArrowLeft, Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImportOrders({ onNavigate }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === 'text/csv' || selected.name.toLowerCase().endsWith('.csv'))) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid CSV file.');
    }
  };

  const handleImport = () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.replace(/^\uFEFF/, '').trim().toLowerCase(),
      complete: async (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('The CSV file appears to be empty.');
          }

          const orders = results.data.map(row => {
            return {
              email: row['email'] || row['email address'] || row['customer email'] || row['customeremail'],
              customerName: row['customername'] || row['customer name'] || row['customer'] || row['name'],
              productName: row['product'] || row['productname'] || row['product name'] || row['item'],
              category: row['category'],
              quantity: row['quantity'] || row['qty'],
              amount: row['amount'] || row['price'] || row['total'] || row['total amount'],
              date: row['date'] || row['order date'] || row['orderdate'],
              status: row['status'] || row['order status'] || row['orderstatus'],
              phone: row['phone'] || row['phonenumber'] || row['phone number'] || row['customer phone'],
              city: row['city'] || row['town'] || row['customer city'],
              state: row['state'] || row['region'] || row['customer state'],
              country: row['country'] || row['customer country']
            };
          }).filter(o => (o.email || o.customerName) && o.productName);

          if (orders.length === 0) {
            const foundHeaders = Object.keys(results.data[0] || {}).join(', ');
            throw new Error(`No valid orders found. We found these columns: [${foundHeaders}]. Please ensure you have Customer and Product columns.`);
          }

          const response = await axios.post('/api/orders/import', { orders });
          setResult({ success: true, message: response.data.message });
        } catch (err) {
          setError(err.response?.data?.error || err.message || 'Failed to import orders');
        } finally {
          setIsProcessing(false);
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Import Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Upload a CSV file to bulk import order history.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        {result ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h2>
            <p className="text-gray-500 mb-6">{result.message}</p>
            <button onClick={() => onNavigate('list')} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Return to Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Supported CSV Columns:</p>
              <p><code>Email</code>, <code>CustomerName</code>, <code>Product</code>, <code>Category</code>, <code>Quantity</code>, <code>Amount</code>, <code>Date</code>, <code>Status</code></p>
              <p className="mt-2 text-xs opacity-80">Note: Email and Product are required. If a customer doesn't exist, they will be auto-created.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors">
              <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileChange} />
              <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <FileType size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {file ? file.name : 'Select a CSV file'}
                </h3>
                <p className="text-sm text-gray-500">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Click to browse or drag and drop'}
                </p>
              </label>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleImport} 
                disabled={!file || isProcessing}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Import Orders</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
