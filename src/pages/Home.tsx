import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Classify',
      description: 'Quickly classify your CV into relevant categories',
      path: '/classify',
      icon: '📋',
    },
    {
      title: 'Classify & Read',
      description: 'Extract detailed information from your CV and read its content',
      path: '/classify-read',
      icon: '📖',
    },
    {
      title: 'Full Analysis',
      description: 'Get comprehensive analysis with detailed metrics',
      path: '/classify-read-metrics',
      icon: '📊',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center bg-white mt-2">
      <div className="w-full    max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to CV Reader
          </h1>
          <p className="text-lg text-gray-500 mx-auto">
            Upload and analyze your CV with our powerful AI-driven tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path} 
            className="bg-white rounded-xl border mb-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-center">
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {feature.description}
              </p>
              <div className="pt-2">
                <span className="inline-block px-8 py-3 text-base font-semibold text-white bg-[#e5322d] rounded-lg hover:bg-[#c62828] transition-colors">
                    Get Started
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
