"use client";

import { useSession } from "next-auth/react";
import Button from "../ui/Button";
import { ChangeEvent, FormEvent, useState } from "react";
import useComment from "@/hooks/useComment";

type Props = {
  postId: string;
  commentId?: string;
};

const inputStyle = "tablet:px-3 py-2 placeholder:text-sm input";

export default function CommentForm({ postId, commentId }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const { setComment } = useComment(postId);
  const [form, setForm] = useState(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.text) {
      alert("댓글을 입력해주세요😊");
      return;
    }
    let data;
    if (user) {
      data = { text: form.text };
    } else {
      if (!form.guestName) {
        alert("이름을 입력해 주세요😊");
        return;
      } else if (!form.gusetPassword) {
        alert("비밀번호를 입력해주세요😊");
        return;
      }
      data = {
        text: form.text,
        name: form.guestName,
        password: form.gusetPassword,
      };
    }
    if (commentId) data = { ...data, commentId };

    setComment(!!user, data);
    setForm(initialState);
  };

  return (
    <form onSubmit={(e: FormEvent) => e.preventDefault()}>
      <textarea
        name="text"
        placeholder="여러분의 소중한 댓글을 입력해주세요"
        className="w-full h-28 px-3 py-2 textarea"
        onChange={handleChange}
        value={form.text}
        aria-label="댓글 내용"
      />
      <div
        className={`flex ${
          user ? "justify-end" : "justify-between"
        } items-center`}
      >
        {!user && (
          <div className="flex gap-2 items-center">
            <input
              name="guestName"
              type="text"
              placeholder="이름"
              className={inputStyle}
              onChange={handleChange}
              value={form.guestName}
              aria-label="이름"
            />
            <input
              name="gusetPassword"
              type="password"
              placeholder="댓글 비밀번호"
              className={inputStyle}
              onChange={handleChange}
              value={form.gusetPassword}
              aria-label="댓글 비밀번호"
            />
            <Button>간편 로그인</Button>
          </div>
        )}
        <Button color="black" onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </form>
  );
}

const initialState = {
  text: "",
  guestName: "",
  gusetPassword: "",
};
