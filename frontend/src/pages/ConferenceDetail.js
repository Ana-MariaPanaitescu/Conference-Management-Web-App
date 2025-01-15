import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { conferenceAPI, userAPI } from '../../services/api';
import ReviewerAssignment from '../../components/conference/ReviewerAssignment';
import ArticleList from '../../components/conference/ArticleList';
import toast from 'react-hot-toast';

const ConferenceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    loadConferenceData();
    if (user.role === 'organizer') {
      loadReviewers();
    }
  }, [id]);

  const loadConferenceData = async () => {
    try {
      const response = await conferenceAPI.getConference(id);
      setConference(response.data);
    } catch (error) {
      toast.error('Failed to load conference details');
      navigate('/conferences');
    } finally {
      setLoading(false);
    }
  };

  const loadReviewers = async () => {
    try {
      const response = await userAPI.getReviewers();
      setReviewers(response.data);
    } catch (error) {
      toast.error('Failed to load reviewers');
    }
  };

  const handleAssignReviewer = async (reviewerId) => {
    try {
      await conferenceAPI.assignReviewer(id, reviewerId);
      toast.success('Reviewer assigned successfully');
      loadConferenceData();
    } catch (error) {
      toast.error('Failed to assign reviewer');
    }
  };

  const handleDeleteConference = async () => {
    if (window.confirm('Are you sure you want to delete this conference?')) {
      try {
        await conferenceAPI.deleteConference(id);
        toast.success('Conference deleted successfully');
        navigate('/conferences');
      } catch (error) {
        toast.error('Failed to delete conference');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{conference.title}</h1>
              <p className="text-gray-600 mb-4">{conference.description}</p>
            </div>
            {user.role === 'organizer' && user.id === conference.organizerId && (
              <div className="space-x-4">
                <button
                  onClick={() => navigate(`/conferences/${id}/edit`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteConference}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Details</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Location:</span>{' '}
                    {conference.location}
                  </p>
                  <p>
                    <span className="font-medium">Start Date:</span>{' '}
                    {new Date(conference.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">End Date:</span>{' '}
                    {new Date(conference.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Submission Deadline:</span>{' '}
                    {new Date(conference.submissionDeadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {user.role === 'author' && (
                <button
                  onClick={() => navigate(`/conferences/${id}/submit`)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Submit Paper
                </button>
              )}
            </div>

            {user.role === 'organizer' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Manage Reviewers</h3>
                <ReviewerAssignment
                  conferenceId={id}
                  currentReviewers={conference.reviewers}
                  availableReviewers={reviewers}
                  onAssign={handleAssignReviewer}
                />
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Submitted Papers</h3>
            <ArticleList
              articles={conference.articles}
              userRole={user.role}
              conferenceId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetail;