import ChatMain from "@/components/ChatMain";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { logout } from "@/utils/server-actions/auth";

export default async function Home() {
  const data = await fetch(process.env.API_HOST + "/auth/", {
    headers: {
      "Authorization": " Token " + cookies().get("token")?.value
    }
  }).then(
    res => {
      if (res.status !== 200) {
        redirect("/login")
      } else {
        return res.json()
      }
    }
  )

  return (
    <>
      <ChatMain />
      <nav className="p-4 flex gap-2">
        <p>Logged in as {data.username}</p>
        <form action={logout}>
          <button className="text-red-600 border-b border-red-600">Logout </button>
        </form>
      </nav>
    </>
  )
}
