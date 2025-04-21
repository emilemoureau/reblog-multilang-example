import Image from "next/image"

const Test = () => {
  return (
    <div>
      <Image
        src="https://reblog-multilang-example.reblog.so/test.png"
        alt="test"
        width={100}
        height={100}
      />
    </div>
  )
}

export default Test