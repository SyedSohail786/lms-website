import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import SubjectForm from './SubjectForm';

const SubjectList = ({ courseId }) => {
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get(`/api/subjects/${courseId}`);
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [courseId]);

  const handleCreate = async (formData) => {
    try {
      const res = await api.post('/api/subjects', formData);
      setSubjects([...subjects, res.data]);
      setEditingSubject(null);
    } catch (err) {
      console.error('Failed to create subject:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await api.put(`/api/subjects/${editingSubject._id}`, formData);
      setSubjects(subjects.map(s => s._id === res.data._id ? res.data : s));
      setEditingSubject(null);
    } catch (err) {
      console.error('Failed to update subject:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      await api.delete(`/api/subjects/${id}`);
      setSubjects(subjects.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to delete subject:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Subjects</h2>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">
          {editingSubject ? 'Edit Subject' : 'Add New Subject'}
        </h3>
        <SubjectForm 
          initialData={editingSubject || { course: courseId }} 
          onSubmit={editingSubject ? handleUpdate : handleCreate} 
        />
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">All Subjects</h3>
        {subjects.length === 0 ? (
          <p>No subjects found</p>
        ) : (
          <ul className="divide-y">
            {subjects.map(subject => (
              <li key={subject._id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{subject.title}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSubject(subject)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubjectList;