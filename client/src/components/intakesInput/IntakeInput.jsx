import React, { useState } from 'react';

// Validation: must be "YYYY/YYYY" where YYYY is a 4-digit year
const isValidIntake = (value) => /^\d{4}\/\d{4}$/.test(value);
export const IntakeInput = ({ value = [], onChange }) => {
  const [items, setItems] = useState(value);
  const [newIntake, setNewIntake] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  // Update parent when items change
  const updateItems = (newItems) => {
    setItems(newItems);
    if (onChange) onChange(newItems);
  };

  // Add new intake
  const handleAdd = () => {
    if (!newIntake.trim()) {
      setError('يرجى إدخال قيمة');
      return;
    }
    if (!isValidIntake(newIntake)) {
      setError('الصيغة يجب أن تكون سنة/سنة مثلاً 2025/2026');
      return;
    }
    if (items.includes(newIntake)) {
      setError('هذه القيمة موجودة بالفعل');
      return;
    }
    updateItems([...items, newIntake]);
    setNewIntake('');
    setError('');
    onChange("intakes",[...items, newIntake]);
  };

  // Delete intake
  const handleDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateItems(newItems);
    if (editingIndex === index) setEditingIndex(null);
  };

  // Start editing
  const handleEditStart = (index) => {
    setEditingIndex(index);
    setEditValue(items[index]);
    setError('');
  };

  // Save edited intake
  const handleEditSave = (index) => {
    if (!editValue.trim()) {
      setError('لا يمكن أن تكون القيمة فارغة');
      return;
    }
    if (!isValidIntake(editValue)) {
      setError('الصيغة يجب أن تكون سنة/سنة مثلاً 2025/2026');
      return;
    }
    // Check for duplicate (excluding current item)
    if (items.some((item, i) => i !== index && item === editValue)) {
      setError('هذه القيمة موجودة بالفعل');
      return;
    }
    const newItems = [...items];
    newItems[index] = editValue;
    updateItems(newItems);
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };


  return(
    <div className="space-y-3">
      {/* Add new intake */}
      <div className="flex flex-col gap-2">
        <label htmlFor="intakes" className="">دفعات المدرسة</label>
        <input
          id='intakes'
          type="text"
          value={newIntake}
          onChange={(e) => setNewIntake(e.target.value)}
          placeholder="مثال: 2025/2026"
          className="flex-1 h-10 p-2 border rounded"
        />
        <div className='flex justify-end'>
           <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded text-sm w-max"
        >
          إضافة
        </button>
        </div>
       
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* List of intakes */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">لا توجد دفعات مضافة بعد</p>
      ) : (
        <ul className="space-y-2">
          {items.map((intake, index) => (
            <li key={index} className="flex items-center gap-2 border p-2 rounded">
              {editingIndex === index ? (
                // Edit mode
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 p-1 border rounded"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleEditSave(index)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                // View mode
                <>
                  <span className="flex-1">{intake}</span>
                  <button
                    type="button"
                    onClick={() => handleEditStart(index)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    حذف
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

