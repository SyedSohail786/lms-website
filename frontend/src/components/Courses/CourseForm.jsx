import { useState } from 'react';

const CourseForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows="3"
        />
      </div>
      
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
      >
        {initialData._id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default CourseForm;