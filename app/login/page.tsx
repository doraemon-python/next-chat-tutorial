"use client"

import { login } from "@/utils/server-actions/auth";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const Page = () => {
  const [showCode, setShowCode] = useState(false);
  const [message, setMessage] = useState("");
  const submitBtnId = "submitBtn";

  const action = async (formData: FormData) => {
    const res = await login(formData);
    if (res) {
      setShowCode(res.second);
      setMessage("error" in res ? res.error : "");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 text-center">
      <h1 className="my-8 text-3xl font-bold">Please Login</h1>
      <form action={action} className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <label htmlFor="email" className="text-lg">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border-b border-gray-300 flex-grow p-1"
            placeholder="Enter Email"
          />
        </div>
        {showCode && <CodeField submitBtnId={submitBtnId} />}
        {message && <p className="text-red-500">{message}</p>}
        <SubmitBtn submitBtnId={submitBtnId} />
      </form>
    </main>
  );
}

export default Page;

const CodeField = ({ submitBtnId }: { submitBtnId: string }) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    value.length === 6 && document.getElementById(submitBtnId)?.click();
  }, [value, submitBtnId])


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 6) {
      return;
    }
    setValue(e.target.value);
  }

  return (
    <div className="flex gap-4 items-center">
      <label htmlFor="code">Code: </label>
      <div className="flex gap-2 relative">
        {value.split("").map((s, i) => (
          <p
            key={i}
            className="bg-gray-100 w-8 py-3 rounded-md"
          >
            {s}
          </p>
        ))}
        {value.length < 6 && [...Array(6 - value.length)].map((_, i) => (
          <p
            key={i}
            className={
              "w-8 py-3 rounded-md " +
              ((i === 0 && focused) ? "bg-gray-200" : "bg-gray-100")
            }
          >
            |
          </p>
        ))}
        <input
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="text"
          inputMode="numeric"
          name="code"
          id="code"
          className="absolute top-0 left-0 opacity-0 w-full h-full"
        />
      </div>
    </div>
  );
}

const SubmitBtn = ({ submitBtnId }: { submitBtnId: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      id={submitBtnId}
      type="submit"
      disabled={pending}
      className={
        "w-1/3 mx-auto text-white rounded-md py-2 " +
        (pending ? "bg-gray-500" : "bg-sky-500 hover:bg-sky-600")
      }
    >
      {pending ? "Loading..." : "Submit"}
    </button>
  )
}