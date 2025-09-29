import ClientsPage from '@/components/client/ClientComponent'
import Dashboard from './booked-appointment/Dashboard '

const page = () => {
  return (
    <div className=' flex flex-col' >
        <Dashboard />;
      <ClientsPage/>  
    </div>
  )
}

export default page