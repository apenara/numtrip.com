'use client';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  subtitle?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  onClick
}: DashboardCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;
  const hasClickHandler = onClick !== undefined;

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${
        hasClickHandler ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <div className={`flex items-center text-sm ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="font-medium">
              {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      )}
    </div>
  );
}