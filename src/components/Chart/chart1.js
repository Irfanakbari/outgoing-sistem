import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'BA',
        stok: 4000,
    },
    {
        name: 'BB',
        stok: 3000,
    },
];

export default class Example extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/tiny-bar-chart-35meb';

    render() {
        return (
            <ResponsiveContainer>
                <BarChart width={150} height={40} data={data}>
                    <Bar dataKey="stok" fill="#8884d8" />
                    <XAxis dataKey="name" label={{ value: 'Kode Part', position: 'insideCenter' }} />
                    <YAxis label={{ value: 'Total Stok', angle: -90, position: 'insideLeft' }} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
