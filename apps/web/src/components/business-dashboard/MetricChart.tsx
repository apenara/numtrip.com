'use client';

interface ChartData {
  views: Array<{ month: string; value: number }>;
  clicks: Array<{ month: string; value: number }>;
}

interface MetricChartProps {
  title: string;
  data: ChartData;
}

export function MetricChart({ title, data }: MetricChartProps) {
  // Calculate max value for scaling
  const maxViews = Math.max(...data.views.map(d => d.value));
  const maxClicks = Math.max(...data.clicks.map(d => d.value));
  const maxValue = Math.max(maxViews, maxClicks);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Views</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Clicks</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.views.map((item, index) => {
          const viewsPercent = (item.value / maxValue) * 100;
          const clicksPercent = (data.clicks[index]?.value / maxValue) * 100;

          return (
            <div key={item.month} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{item.month}</span>
                <div className="space-x-4">
                  <span className="text-blue-600">{item.value} views</span>
                  <span className="text-green-600">{data.clicks[index]?.value || 0} clicks</span>
                </div>
              </div>
              
              <div className="space-y-1">
                {/* Views bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${viewsPercent}%` }}
                  />
                </div>
                
                {/* Clicks bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${clicksPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {data.views.reduce((sum, item) => sum + item.value, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {data.clicks.reduce((sum, item) => sum + item.value, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Clicks</p>
          </div>
        </div>
      </div>
    </div>
  );
}