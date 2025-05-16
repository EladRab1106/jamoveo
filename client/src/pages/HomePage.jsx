import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // const handleRegister = (role) => {
  //   navigate(`/register?as=${role}`);
  //   setShowModal(false);
  // };

  return (
    <div
  className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white px-4"
      style={{ backgroundImage: `url('/mainBG.png')` }}

    >
      <h1 className="text-5xl md:text-6xl font-bold mb-4 font-sans text-white">🎵 Jamoveo</h1>
      <p className="text-xl md:text-2xl mb-10 text-center">
        המערכת שתחבר זמרים ונגנים בזמן אמת.
      </p>

      <div className="flex gap-4">
        <button
          className="bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold py-2 px-6 rounded-full shadow-lg"
          onClick={() => navigate('/login')}
        >
          התחברות
        </button>

        <button
          className="bg-gradient-to-r from-indigo-900 to-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-lg"
          onClick={() => setShowModal(true)}
        >
          הרשמה
        </button>
      </div>

      {/* מודל הרשמה לפי תפקיד */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl space-y-4 w-80 shadow-2xl">
            <h2 className="text-xl font-semibold text-center mb-4">הרשמה כ:</h2>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
               זמר או נגן
            </button>
            
            <button
              onClick={() => navigate('/admin/register')}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg"
            >
              אדמין 👨‍💼
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 text-sm text-center text-gray-500 hover:underline"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
