import { useState, useRef } from 'react';
import Aurora from '@/components/Aurora';
import axios from 'axios';
import Output from './Output';
import Footer from '../components/Footer';

const Home = () => {
  const [aRoll, setARoll] = useState(null);
  const [bRolls, setBRolls] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const aRollInputRef = useRef(null);
  const bRollInputRef = useRef(null);

  const handleARollChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setARoll({
        file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleBRollChange = (e) => {
    const files = Array.from(e.target.files);
    const newBRolls = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setBRolls(prev => [...prev, ...newBRolls]);
  };

  const removeBRoll = (index) => {
    setBRolls(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(){
    setLoading(true);
    if(aRoll===null){
      alert("Please upload an A-Roll video.");
      setLoading(false);
      return;
    }
    if(bRolls.length===0){
      alert("Please upload at least one B-Roll video.");
      setLoading(false);
      return;
    }
    const formData= new FormData();
    formData.append('a_roll', aRoll.file);
    bRolls.forEach((bRoll, index)=>{
      formData.append('b_rolls', bRoll.file);
    });
    try {
      const request= await axios.post('http://localhost:3000/upload', formData);
      const response= request.data;
      console.log(response);
      
      setData(response);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  }

  if (data) {
    return <Output data={data} />;
  }

  return (
    
    <div className="min-h-screen bg-black text-gray-100 p-6 md:p-12 font-sans selection:bg-orange-500/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <Aurora
          colorStops={["#2DD4BF", "#F97316", "#F59E0B"]}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
      <header className="mb-12 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-instrument italic">
          <span className="text-white">
            Smart B-Roll Video Inserter
          </span>
        </h1>
        <p className="text-gray-400 text-lg font-instrument italic">Upload your footage to get started</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="flex flex-col space-y-4">
          <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-teal-400 font-instrument">
              <span className="w-3 h-3 rounded-full font-geist-mono bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></span>
              A-Roll (Main Video)
            </h2>

            <div className="flex-1 flex flex-col">
              {!aRoll ? (
                <div
                  onClick={() => aRollInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-gray-800/50 transition-all duration-300 group min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-teal-500/20">
                    <svg className="w-10 h-10 text-gray-400 group-hover:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-gray-300 group-hover:text-white">Upload A-Roll</p>
                  <p className="text-sm text-gray-500 mt-2">Click to browse single video</p>
                </div>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-700 bg-black flex-1 flex items-center justify-center">
                  <video
                    src={aRoll.url}
                    controls
                    className="w-full h-full object-contain max-h-[600px]"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setARoll(null)}
                      className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-medium truncate">{aRoll.file.name}</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={aRollInputRef}
                onChange={handleARollChange}
                accept="video/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-orange-400 font-instrument">
                <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                B-Rolls (Overlays)
              </h2>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs font-mono text-gray-400 border border-gray-700">
                {bRolls.length} Videos
              </span>
            </div>

            <div className="flex-1 flex flex-col space-y-6">
              <div
                onClick={() => bRollInputRef.current?.click()}
                className="h-40 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-gray-800/50 transition-all duration-300 group shrink-0"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-orange-500/20">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium text-gray-300 group-hover:text-white">Add B-Roll Videos</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar min-h-[300px] max-h-[600px]">
                {bRolls.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-600 italic">
                    No B-roll videos added yet
                  </div>
                ) : (
                  bRolls.map((video, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-800/40 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors group">
                      <div className="w-32 h-20 bg-black rounded-lg overflow-hidden shrink-0 relative">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-gray-200 font-medium truncate mb-1">{video.file.name}</p>
                        <p className="text-xs text-gray-500">{(video.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => removeBRoll(index)}
                        className="self-center p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={bRollInputRef}
            onChange={handleBRollChange}
            accept="video/*"
            multiple
            className="hidden"
          />
        </div>
      </div>
      <div className="mt-12 mb-8 w-full flex justify-center">
        <button onClick={handleSubmit} className="relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white transition-all duration-300 bg-transparent border border-white/20 rounded-full hover:bg-white/5 hover:border-white/40 hover:scale-105 active:scale-95 group font-instrument tracking-widest uppercase overflow-hidden cursor-pointer">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500/20 via-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500/10 via-orange-500/10 to-amber-500/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            Process Video
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
        </button>
      </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-orange-500/20 border-b-orange-500 rounded-full animate-spin reverse-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-4xl font-instrument italic text-white mb-3 tracking-wide">Processing Footage</h3>
          <p className="text-white/40 font-sans text-sm tracking-widest uppercase">Analyzing Logic & Context</p>
        </div>
      )}
      <div className="relative z-10 w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
