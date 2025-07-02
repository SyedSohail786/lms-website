import { useState, useRef } from 'react';
import { FiUpload, FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const baseurl = import.meta.env.VITE_API_BASE_URL;
import Cookies from 'js-cookie';

const CourseForm = ({ initialData = {}, onSubmit, onCancel, setEditingCourse }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: initialData.title || '',
    instructor: initialData.instructor || '',
    category: initialData.category || 'Web Development',
    level: initialData.level || 'Beginner',
    duration: initialData.duration?.value || 8,
    durationUnit: initialData.duration?.unit || 'weeks',
    description: initialData.description || '',
    thumbnail: initialData.thumbnail || '',
    thumbnailFile: null,
    rating: initialData.rating || 4.5,
    students: initialData.students || 0,
    price: initialData.price || 0,
    isFeatured: initialData.isFeatured || false,
    modules: initialData.modules?.length ? initialData.modules : [
      { title: 'Introduction', lessons: ['Getting Started'] }
    ]
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Marketing', 'Design', 'Business', 'Photography', 'Music'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axios.post(`${baseurl}/api/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        withCredentials: true
      });
      setForm(prev => ({ ...prev, thumbnail: data.url, thumbnailFile: file }));
      toast.success(data.message || 'Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...form.modules];
    updatedModules[index][field] = value;
    setForm(prev => ({ ...prev, modules: updatedModules }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, value) => {
    const updatedModules = [...form.modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = value;
    setForm(prev => ({ ...prev, modules: updatedModules }));
  };

  const addModule = () => {
    setForm(prev => ({ ...prev, modules: [...prev.modules, { title: 'New Module', lessons: ['New Lesson'] }] }));
    setActiveModuleIndex(form.modules.length);
  };

  const removeModule = (index) => {
    if (form.modules.length <= 1) {
      toast.error('Course must have at least one module');
      return;
    }
    const updatedModules = form.modules.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, modules: updatedModules }));
    setActiveModuleIndex(Math.min(index, updatedModules.length - 1));
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...form.modules];
    updatedModules[moduleIndex].lessons.push('New Lesson');
    setForm(prev => ({ ...prev, modules: updatedModules }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...form.modules];
    if (updatedModules[moduleIndex].lessons.length <= 1) {
      toast.error('Module must have at least one lesson');
      return;
    }
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setForm(prev => ({ ...prev, modules: updatedModules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const courseData = {
        title: form.title.trim(),
        instructor: form.instructor.trim(),
        category: form.category,
        level: form.level,
        duration: { value: parseInt(form.duration), unit: form.durationUnit },
        description: form.description.trim(),
        thumbnail: form.thumbnail,
        rating: parseFloat(form.rating),
        students: parseInt(form.students),
        price: parseFloat(form.price),
        isFeatured: form.isFeatured,
        modules: form.modules.map(module => ({
          title: module.title.trim(),
          lessons: module.lessons.map(lesson => lesson.trim()).filter(lesson => lesson)
        }))
      };
      if (!courseData.title || !courseData.description || !courseData.thumbnail) {
        throw new Error('Please fill all required fields');
      }
      await onSubmit(courseData);
      toast.success(`Course ${initialData._id ? 'updated' : 'created'} successfully`);
      onCancel?.();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            {initialData._id ? 'Edit Course' : 'Create New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                  placeholder="e.g., Introduction to Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                  placeholder="Instructor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-20 px-3 sm:px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    min="1"
                    required
                  />
                  <select
                    name="durationUnit"
                    value={form.durationUnit}
                    onChange={handleChange}
                    className="w-24 px-2 sm:px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Students Enrolled
                </label>
                <input
                  type="number"
                  name="students"
                  value={form.students}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  min="0"
                  placeholder="1250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  min="0"
                  step="0.01"
                  placeholder="49.99"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Featured Course
                </label>
              </div>
            </motion.div>

            {/* Thumbnail Upload */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  disabled={isUploading}
                >
                  <FiUpload className="mr-2" />
                  {form.thumbnail ? 'Change Image' : 'Upload Image'}
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
                {isUploading && (
                  <span className="ml-3 text-sm text-gray-500">Uploading...</span>
                )}
              </div>
              {form.thumbnail && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={baseurl + form.thumbnail}
                      alt="Thumbnail preview"
                      className="h-32 sm:h-40 w-auto max-w-full object-cover rounded-lg border border-gray-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, thumbnail: '', thumbnailFile: null }))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform sm:transform-none sm:-top-2 sm:-right-2"
                    >
                      <FiX className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                required
                placeholder="Detailed course description..."
              />
            </motion.div>

            {/* Course Modules */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Course Modules</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addModule}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="mr-1" /> Add Module
                </motion.button>
              </div>

              {form.modules.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No modules added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Module Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
                      {form.modules.map((module, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          onClick={() => setActiveModuleIndex(index)}
                          whileHover={{ scale: 1.05 }}
                          className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${index === activeModuleIndex
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {module.title || `Module ${index + 1}`}
                        </motion.button>
                      ))}
                    </nav>
                  </div>

                  {/* Active Module Content */}
                  <AnimatePresence>
                    {form.modules.map((module, moduleIndex) => (
                      <motion.div
                        key={moduleIndex}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: moduleIndex === activeModuleIndex ? 1 : 0, height: moduleIndex === activeModuleIndex ? 'auto' : 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-gray-50 rounded-lg p-4 sm:p-6 ${moduleIndex === activeModuleIndex ? 'block' : 'hidden'}`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Module {moduleIndex + 1}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeModule(moduleIndex)}
                            className="text-red-600 hover:text-red-800"
                            disabled={form.modules.length <= 1}
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Module Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            required
                            placeholder="Module title"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Lessons <span className="text-red-500">*</span>
                            </label>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => addLesson(moduleIndex)}
                              className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiPlus className="mr-1" /> Add Lesson
                            </motion.button>
                          </div>

                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center">
                                <input
                                  type="text"
                                  value={lesson}
                                  onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
                                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                  required
                                  placeholder="Lesson title"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                  className="ml-2 text-red-600 hover:text-red-800 p-2"
                                  disabled={module.lessons.length <= 1}
                                >
                                  <FiMinus />
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-end gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? 'Saving...' : initialData._id ? 'Update Course' : 'Create Course'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseForm;