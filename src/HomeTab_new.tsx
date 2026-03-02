// Temporary file for new HomeTab - will be integrated into App.tsx

const newHomeTabReturn = `
    <div className="space-y-6">
      {/* Welcome Section - Full Width */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-[3rem] border-2 border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/20 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="text-yellow-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Welcome Back!</h2>
              <p className="text-sm text-slate-600 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout - 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Takes 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Chart - Large Feature */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">7-Day Progress</h3>
                  <p className="text-sm text-slate-500 font-medium">Your XP journey this week</p>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
 