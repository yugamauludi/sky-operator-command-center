// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import jwt from "jsonwebtoken";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;

  // if (token) {
  //   let isValid = false;

  //   try {
  //     jwt.verify(token, process.env.JWT_SECRET!);
  //     isValid = true;
  //   } catch (err) {
  //     console.error("Invalid token:", err);
  //   }

  //   if (isValid) {
  //     redirect("/");
  //   }
  // }

  // ❌ token tidak ada atau tidak valid
  return <div>{children}</div>;
}
