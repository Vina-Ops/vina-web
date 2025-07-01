import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src=" https://res.cloudinary.com/ddynvenje/image/upload/v1750902308/AHA/myMedlog_hbared.svg"
        alt="myMedicines Logo"
        width={137}
        height={40}
        className="object-cover"
      />
    </Link>
  );
};

export default Logo;
