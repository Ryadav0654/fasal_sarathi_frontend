import React from "react";
import { generateFertilizerReport } from "../utils/pdf-generator";
import { X, Download, Sprout, Leaf } from "lucide-react";

const ShowRecommendentFertilizer = ({ setShowFertilizer, fert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all scale-100">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-green-600 to-emerald-500">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="relative px-6 pt-8 pb-6">
          {/* Close Button */}
          <button
            onClick={() => setShowFertilizer(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 rounded-full p-1.5 backdrop-blur-md"
          >
            <X size={20} />
          </button>

          {/* Header Content */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 rotate-6 hover:rotate-0 transition-transform duration-300">
              <Sprout size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Recommendation</h2>
            <p className="text-green-100 text-sm font-medium">Based on your soil analysis</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mt-2">
            {/* Input Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50/50 rounded-xl p-3 flex items-center gap-3 border border-green-100">
                <div className="bg-green-100 p-2 rounded-lg text-green-700">
                  <Leaf size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Soil Type</p>
                  <p className="text-gray-800 font-bold text-sm">{fert?.soilType}</p>
                </div>
              </div>
              <div className="bg-emerald-50/50 rounded-xl p-3 flex items-center gap-3 border border-emerald-100">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                  <Sprout size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Crop Name</p>
                  <p className="text-gray-800 font-bold text-sm">{fert?.cropType}</p>
                </div>
              </div>
            </div>

            {/* Fertilizer Result */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-green-200/30 transition-all"></div>

              <p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-3">Recommended Fertilizer</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-3 tracking-tight">{fert?.result?.fertilizer_name}</h3>

              <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-green-100">
                <span className="text-gray-400 text-xs font-bold uppercase">Quantity</span>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="text-green-700 font-bold text-sm">{fert?.result?.fertilizer_quantity} kg/acre</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFertilizer(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
              >
                Close
              </button>
              <button
                onClick={() => generateFertilizerReport(fert)}
                className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg shadow-green-200 hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 text-sm group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowRecommendentFertilizer;
