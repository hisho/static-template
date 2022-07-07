import { Head } from "minista"
import { Navigate } from "@src/component/functional/Navigate/Navigate"

export const Index = () => {
  console.log(process.env["NODE_ENV"])
  return (
    <>
      <Head title={"Home"} />
    </>
  )
}

export default Index
