"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";
import { formatPrice } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function SalesAreaChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <div className="w-full h-[300px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 20, // Increased to accommodate XAxis labels with dy
                    }}
                >
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        tickFormatter={(value: number) => `NPR ${value / 1000}k`}
                        width={60}
                    />
                    <Tooltip
                        formatter={(value: number | undefined) => [formatPrice(value || 0), "Revenue"]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopProductsBarChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <div className="w-full h-[300px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Top 5 Products (Units Sold)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={140} // Increased for longer names
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        interval={0}
                    />
                    <Tooltip
                        formatter={(value: number | undefined) => [value, "Units Sold"]}
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CategoryPieChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <div className="w-full h-[300px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number | undefined) => formatPrice(value || 0)}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
