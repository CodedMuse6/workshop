import AdminSgnUp from "../modules/auth/pages/AdminSignUp";


const Home = () => {
  return (
    <div  className="w-full py-8 mt-4 text-center">
      <div className="flex flex-wrap">
        <div  className="p-2 w-full">
        <h1 className="text-2xl font-bold hover:text-gray-500 text-slate-700">WorkShop Feedback</h1>
        <h3 className="text-center text-2xl leading-tight m-8 text-gray-800">SighUp to Create the Workshop</h3>
        </div>
        </div>
        <div className="flex items-center justify-center">
        <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 py-8">
      <AdminSgnUp/>
  </div>
      </div>
    </div>

  )
}

export default Home