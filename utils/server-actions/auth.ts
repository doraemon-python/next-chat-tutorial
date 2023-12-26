"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const login = async (formData: FormData) => {
    const email = formData.get("email")
    const code = formData.get("code")

    if (!code) {
        return fetch(process.env.API_HOST + "/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            cache: "no-cache",
        }).then(res => {
            if (res.status === 200) {
                return { second: true }
            }
            return { second: false }
        })
    } else {
        const res = await fetch(process.env.API_HOST + "/auth/validate/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
            cache: "no-cache",
        })

        if (res.status === 200) {
            const json = await res.json();
            cookies().set("token", json.token)
            redirect("/")
        } else {
            return { second: true, error: (await res.json())["non_field_errors"][0] }
        }
    }
}

export const logout = () => {
    cookies().delete("token")
    redirect("/")
}