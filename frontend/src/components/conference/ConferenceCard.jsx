import React from 'react';
import { Link } from 'react-router-dom';

const ConferenceCard = ({ conference }) => {
  const formattedDate = new Date(conference.date).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{conference.title}</h3>
      <div className="text-gray-600 mb-4">
        <p className="mb-2">Date: {formattedDate}</p>
        <p className="mb-2">Organizer: {conference.organizer?.name}</p>
        <p>Reviewers: {conference.reviewers?.length || 0}</p>
      </div>
      <p className="text-gray-700 mb-4 line-clamp-3">{conference.description}</p>
      <Link
        to={`/conferences/${conference.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        View Details →
      </Link>
    </div>
  );
};

export default ConferenceCard;