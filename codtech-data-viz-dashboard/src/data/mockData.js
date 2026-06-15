export const revenueData = [
  { month: "Jan", revenue2024: 42000, revenue2023: 35000 },
  { month: "Feb", revenue2024: 55000, revenue2023: 41000 },
  { month: "Mar", revenue2024: 48000, revenue2023: 38000 },
  { month: "Apr", revenue2024: 61000, revenue2023: 45000 },
  { month: "May", revenue2024: 59000, revenue2023: 48000 },
  { month: "Jun", revenue2024: 72000, revenue2023: 52000 },
  { month: "Jul", revenue2024: 68000, revenue2023: 50000 },
  { month: "Aug", revenue2024: 75000, revenue2023: 56000 },
  { month: "Sep", revenue2024: 82000, revenue2023: 61000 },
  { month: "Oct", revenue2024: 79000, revenue2023: 63000 },
  { month: "Nov", revenue2024: 95000, revenue2023: 72000 },
  { month: "Dec", revenue2024: 110000, revenue2023: 85000 },
];

export const userGrowthData = [
  { month: "Jan", newUsers: 1200, returningUsers: 3400 },
  { month: "Feb", newUsers: 1400, returningUsers: 3500 },
  { month: "Mar", newUsers: 1300, returningUsers: 3800 },
  { month: "Apr", newUsers: 1800, returningUsers: 4100 },
  { month: "May", newUsers: 2100, returningUsers: 4300 },
  { month: "Jun", newUsers: 2400, returningUsers: 4500 },
  { month: "Jul", newUsers: 2200, returningUsers: 4800 },
  { month: "Aug", newUsers: 2800, returningUsers: 5100 },
  { month: "Sep", newUsers: 3100, returningUsers: 5300 },
  { month: "Oct", newUsers: 2900, returningUsers: 5600 },
  { month: "Nov", newUsers: 3500, returningUsers: 5900 },
  { month: "Dec", newUsers: 4200, returningUsers: 6400 },
];

export const categoryData = [
  { name: 'Electronics', value: 400, color: '#0088FE' },
  { name: 'Clothing', value: 300, color: '#00C49F' },
  { name: 'Books', value: 300, color: '#FFBB28' },
  { name: 'Home', value: 200, color: '#FF8042' },
  { name: 'Toys', value: 100, color: '#A28CFE' },
];

export const statCards = [
  { 
    title: 'Total Revenue', 
    value: '$45,231.89', 
    change: '+20.1%', 
    positive: true,
    sparklineData: [
      { pv: 2400 }, { pv: 1398 }, { pv: 9800 }, { pv: 3908 }, { pv: 4800 }, { pv: 3800 }, { pv: 4300 }
    ]
  },
  { 
    title: 'Active Users', 
    value: '23,500', 
    change: '+15.2%', 
    positive: true,
    sparklineData: [
      { pv: 1200 }, { pv: 1500 }, { pv: 1400 }, { pv: 2000 }, { pv: 1900 }, { pv: 2200 }, { pv: 2800 }
    ]
  },
  { 
    title: 'Total Orders', 
    value: '4,200', 
    change: '+5.4%', 
    positive: true,
    sparklineData: [
      { pv: 300 }, { pv: 400 }, { pv: 350 }, { pv: 500 }, { pv: 480 }, { pv: 550 }, { pv: 600 }
    ]
  },
  { 
    title: 'Bounce Rate', 
    value: '24.5%', 
    change: '-2.1%', 
    positive: false,
    sparklineData: [
      { pv: 40 }, { pv: 38 }, { pv: 42 }, { pv: 35 }, { pv: 30 }, { pv: 28 }, { pv: 24 }
    ]
  },
];

export const trafficSources = [
  { name: 'Organic', value: 40, color: '#10B981' },
  { name: 'Social', value: 25, color: '#3B82F6' },
  { name: 'Direct', value: 20, color: '#6366F1' },
  { name: 'Referral', value: 15, color: '#F59E0B' },
];

export const recentTransactions = [
  { id: 1, name: 'John Doe', email: 'john@example.com', amount: '+$499.00', date: 'Today, 10:24 AM', status: 'Completed' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', amount: '+$120.50', date: 'Today, 09:12 AM', status: 'Completed' },
  { id: 3, name: 'Mike Ross', email: 'mike@example.com', amount: '+$899.99', date: 'Yesterday', status: 'Pending' },
  { id: 4, name: 'Anna Lee', email: 'anna@example.com', amount: '+$340.00', date: 'Yesterday', status: 'Completed' },
];

export const aiInsights = [
  { id: 1, text: 'Revenue increased by 20% compared to last week.', type: 'positive' },
  { id: 2, text: 'Orders from Social Media are up by 15%.', type: 'positive' },
  { id: 3, text: 'Bounce rate decreased by 2.1%.', type: 'positive' },
  { id: 4, text: 'Consider running a promo for "Toys" to boost low sales.', type: 'warning' },
];

export const weeklyOrdersData = [
  { week: "Week 1", completed: 120, cancelled: 18 },
  { week: "Week 2", completed: 135, cancelled: 22 },
  { week: "Week 3", completed: 150, cancelled: 15 },
  { week: "Week 4", completed: 125, cancelled: 25 },
  { week: "Week 5", completed: 160, cancelled: 19 },
  { week: "Week 6", completed: 180, cancelled: 12 },
  { week: "Week 7", completed: 175, cancelled: 14 },
  { week: "Week 8", completed: 190, cancelled: 10 },
];

export const topProducts = [
  { product: "Product A", revenue: 120000 },
  { product: "Product B", revenue: 98500 },
  { product: "Product C", revenue: 87200 },
  { product: "Product D", revenue: 74600 },
  { product: "Product E", revenue: 61100 },
];

export const deviceData = [
  { month: "Jan", Desktop: 4200, Mobile: 3100, Tablet: 900 },
  { month: "Feb", Desktop: 4500, Mobile: 3400, Tablet: 950 },
  { month: "Mar", Desktop: 4300, Mobile: 3800, Tablet: 1050 },
  { month: "Apr", Desktop: 4800, Mobile: 4200, Tablet: 1100 },
  { month: "May", Desktop: 4900, Mobile: 4500, Tablet: 1200 },
  { month: "Jun", Desktop: 5200, Mobile: 4900, Tablet: 1300 },
];
