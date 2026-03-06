const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Public Service CRM
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Efficient public service management for citizens and officials
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Submit Complaints</h3>
            <p className="text-gray-600">Easily file and track your public service complaints</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor the status of your submissions in real-time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Quick Resolution</h3>
            <p className="text-gray-600">Get timely responses and resolutions from concerned departments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
