// SubjectList.js
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import SubjectForm from './SubjectForm';
import LoadingSpinner from '../LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const SubjectList = ({ courseId }) => {
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create subject:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await api.put(`/api/subjects/${editingSubject._id}`, formData);
      setSubjects(subjects.map(s => s._id === res.data._id ? res.data : s));
      setEditingSubject(null);
      setShowForm(false);
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

  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
    setShowForm(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingSubject ? 'Edit Subject' : 'Subjects'}
          </h3>
          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingSubject(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiPlus /> Add Subject
            </motion.button>
          )}
        </div>

        {(showForm || editingSubject) ? (
          <SubjectForm 
            initialData={editingSubject || { course: courseId }} 
            onSubmit={editingSubject ? handleUpdate : handleCreate}
            onCancel={handleCancelEdit}
          />
        ) : (
          subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No subjects found</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="inline mr-2" />
                Add First Subject
              </motion.button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {subjects.map(subject => (
                  <motion.li
                    key={subject._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{subject.title}</h4>
                      <p className="text-sm text-gray-500">{subject.course?.title}</p>
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(subject)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(subject._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )
        )}
      </motion.div>
    </div>
  );
};

export default SubjectList;