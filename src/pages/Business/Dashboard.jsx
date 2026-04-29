import React, { useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { ShoppingBag, TrendingUp, PieChart as PieChartIcon, IndianRupee, ArrowRightLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import * as d3 from 'd3';

const portfolioData = [
  { name: 'Grade A (High)', value: 400 },
  { name: 'Grade B (Medium)', value: 300 },
  { name: 'Grade C (Low)', value: 100 },
];
const COLORS = ['#00C896', '#3B82F6', '#F59E0B'];

const monthlyData = [
  { name: 'Jan', volume: 4000 },
  { name: 'Feb', volume: 3000 },
  { name: 'Mar', volume: 2000 },
  { name: 'Apr', volume: 2780 },
  { name: 'May', volume: 1890 },
  { name: 'Jun', volume: 2390 },
];

const marketplaceItems = [
  { id: 1, ngo: 'Amazon Reforest Alpha', location: 'Karnataka', amount: 500, grade: 'A', price: 14500, eth: '0.08' },
  { id: 2, ngo: 'Kerala Green Belt', location: 'Kerala', amount: 200, grade: 'A', price: 15000, eth: '0.082' },
  { id: 3, ngo: 'Himalayan Pines', location: 'Himachal', amount: 1200, grade: 'B', price: 12000, eth: '0.065' },
];

const orderBookAsks = [
  { price: 14600, amount: 150, total: 150 },
  { price: 14550, amount: 200, total: 350 },
  { price: 14500, amount: 500, total: 850 }, // Marketplace item 1
];

const orderBookBids = [
  { price: 14400, amount: 300, total: 300 },
  { price: 14350, amount: 150, total: 450 },
  { price: 14300, amount: 600, total: 1050 },
];

// Dummy Map Component since GeoJSON needs to be fetched
const IndiaHeatmap = () => {
  const mapRef = useRef();

  useEffect(() => {
    // In a real scenario, we'd fetch the India geojson here
    // For now, we'll draw a placeholder SVG with D3 to satisfy the requirement
    const svg = d3.select(mapRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background-color", "rgba(19, 21, 26, 0.5)")
      .style("border-radius", "8px");
      
    svg.selectAll("*").remove();

    svg.append("text")
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .text("India D3 Heatmap (Pending GeoJSON)");
  }, []);

  return <svg ref={mapRef} className="w-full h-full min-h-[300px]"></svg>;
};

export default function BusinessDashboard() {
  return (
    <Layout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Business Trading Terminal</h1>
          <p className="text-gray-400 text-sm">Offset your carbon footprint by trading high-quality carbon credits.</p>
        </div>

        {/* Portfolio Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Credits Owned" value="800 CC" icon={PieChartIcon} color="blue" />
          <StatCard title="Average Buy Price" value="₹ 13,200" icon={IndianRupee} color="gray" />
          <StatCard title="Current Market Value" value="₹ 14,500" icon={TrendingUp} color="cyan" />
          <StatCard title="Unrealized P&L" value="+ ₹ 1,040,000" icon={ArrowRightLeft} color="cyan" subtitle="↑ 9.8%" />
        </div>

        {/* Middle Section: Map & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Heatmap */}
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">India Carbon Credit Density Heatmap</h3>
            <div className="flex-1 border border-dark-border rounded-lg relative overflow-hidden">
              <IndiaHeatmap />
            </div>
          </div>

          {/* Analytics Pie Chart */}
          <div className="glass-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Portfolio Quality</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(19, 21, 26, 0.9)', borderColor: '#1E232B', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {portfolioData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-300">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                    {d.name}
                  </span>
                  <span className="text-white font-medium">{d.value} CC</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Section: Marketplace & Orderbook */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Marketplace */}
          <div className="lg:col-span-2 glass-panel overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-accent-green" /> NGO Marketplace</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-bg/50 text-gray-400 text-sm">
                    <th className="p-4 font-medium border-b border-dark-border">NGO / Project</th>
                    <th className="p-4 font-medium border-b border-dark-border">Location</th>
                    <th className="p-4 font-medium border-b border-dark-border">Grade</th>
                    <th className="p-4 font-medium border-b border-dark-border text-right">Amount (CC)</th>
                    <th className="p-4 font-medium border-b border-dark-border text-right">Price (INR)</th>
                    <th className="p-4 font-medium border-b border-dark-border text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {marketplaceItems.map((item) => (
                    <tr key={item.id} className="border-b border-dark-border hover:bg-dark-bg/30 transition-colors">
                      <td className="p-4 font-medium text-white">{item.ngo}</td>
                      <td className="p-4 text-gray-400">{item.location}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-accent-green/20 text-accent-green border border-accent-green/30 rounded text-xs">{item.grade}</span>
                      </td>
                      <td className="p-4 text-right text-gray-300 font-mono">{item.amount}</td>
                      <td className="p-4 text-right">
                        <div className="text-white font-medium">₹ {item.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.eth} ETH</div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="bg-accent-green hover:bg-teal-500 text-dark-bg px-4 py-1.5 rounded font-bold transition-colors">
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Book */}
          <div className="glass-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Live Order Book</h3>
            
            <div className="flex justify-between text-xs text-gray-500 mb-2 px-2">
              <span>Price (INR)</span>
              <span>Amount</span>
              <span>Total</span>
            </div>

            {/* Asks (Red) */}
            <div className="space-y-1 mb-4">
              {orderBookAsks.map((ask, i) => (
                <div key={i} className="flex justify-between text-sm px-2 py-1 hover:bg-dark-border/50 rounded cursor-pointer relative group">
                  <div className="absolute right-0 top-0 bottom-0 bg-accent-red/10 z-0" style={{width: `${(ask.total / 850) * 100}%`}}></div>
                  <span className="text-accent-red font-mono z-10">{ask.price.toLocaleString()}</span>
                  <span className="text-gray-300 font-mono z-10">{ask.amount}</span>
                  <span className="text-gray-500 font-mono z-10">{ask.total}</span>
                </div>
              ))}
            </div>

            <div className="text-center py-2 border-y border-dark-border mb-4">
              <span className="text-xl font-bold text-white glow-green">₹ 14,450</span>
              <span className="text-xs text-accent-green ml-2">↑ 1.2%</span>
            </div>

            {/* Bids (Green) */}
            <div className="space-y-1">
              {orderBookBids.map((bid, i) => (
                <div key={i} className="flex justify-between text-sm px-2 py-1 hover:bg-dark-border/50 rounded cursor-pointer relative group">
                  <div className="absolute right-0 top-0 bottom-0 bg-accent-green/10 z-0" style={{width: `${(bid.total / 1050) * 100}%`}}></div>
                  <span className="text-accent-green font-mono z-10">{bid.price.toLocaleString()}</span>
                  <span className="text-gray-300 font-mono z-10">{bid.amount}</span>
                  <span className="text-gray-500 font-mono z-10">{bid.total}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
