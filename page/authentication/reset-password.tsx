import React, { useState } from "react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const isValid =
    password.length > 0 && confirm.length > 0 && password === confirm;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 flex flex-col items-center">
      <Icon
        name="Key"
        className="w-12 h-12 text-green-900 dark:text-green-300 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Create a new strong password
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Enter and confirm your new password.
      </p>
      <form className="w-full space-y-4">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={!isValid}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
