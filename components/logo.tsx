import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="">
      <Image
        src={
          "https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-logo_jeyist.svg"
        }
        alt="Logo"
        width={40}
        height={40}
        className="w-14 h-14"
      />
    </Link>
  );
};

export default Logo;
