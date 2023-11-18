import Categorys from "@/components/Categorys"
import Header from "@/components/Header"
import Items from "@/components/Items"

export default function Home() {
  return (
    <main className=" bg-white h-screen w-screen ">
      <div className="2xl:container 2xl:mx-auto sm:py-6 sm:px-7 py-5 px-4">
        <Header/>
          <div>
            <Categorys/>
            <Items/>
          </div>
      </div>
    </main>
  )
}
