import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { authAPI, subjectsAPI, notesAPI } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiFile } from 'react-icons/fi';

export default function AdminDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      await authAPI.verifyToken();
    } catch (error) {
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    try {
      const [subjectsData, notesData] = await Promise.all([
        subjectsAPI.getAll(),
        notesAPI.getAll()
      ]);
      setSubjects(subjectsData);
      setNotes(notesData.notes);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      await subjectsAPI.delete(id);
      toast.success('Subject deleted');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.delete(id);
      toast.success('Note deleted');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Academic Notes</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiPlus /> Add Subject
            </button>
            <button
              onClick={() => setShowAddNote(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiPlus /> Add Note
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <FiFolder className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <FiFile className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Subjects</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
