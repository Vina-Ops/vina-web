import React from 'react'
import {Link} from "next/link"
import {Image} from "next/image"

const Logo = () => {
  return (
    <Link href="">
        <Image
        src={
          "https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-logo_jeyist.svg"
        }
        alt="Logo"
        width={154}
        height={40}
        className="w-40 h-10"
      />
    </Link>
  )
}

export default Logo