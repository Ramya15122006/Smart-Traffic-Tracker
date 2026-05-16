import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const data = [
  { time: '6AM', traffic: 20 },
  { time: '9AM', traffic: 80 },
  { time: '12PM', traffic: 50 },
  { time: '6PM', traffic: 90 },
  { time: '10PM', traffic: 30 },
];

function Dashboard() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Traffic Analytics</h2>

      <LineChart
        width={700}
        height={300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="traffic"
          stroke="#2563eb"
        />
      </LineChart>
    </div>
  );
}

export default Dashboard;