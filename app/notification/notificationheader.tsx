interface NotificationHeaderProps {
  total: number; // Number of unread notifications
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ total }) => (
  <div className="flex justify-between items-center bg-yellow-300 p-4 rounded-md mb-4">
    <h1 className="text-xl font-bold">NOTIFIKASI</h1>
    <span className="bg-red-500 text-white px-3 py-1 rounded-full">{total}</span>
  </div>
);

export default NotificationHeader;
