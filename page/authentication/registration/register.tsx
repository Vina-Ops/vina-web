"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRegistration } from "@/components/auth/RegistrationContext";
import { Select } from "@/components/ui/select/select";
import { registerUser, requestOTP } from "@/services/auth-service";
import { useTopToast } from "@/components/ui/toast";
import { useUser } from "@/context/user-context";
import useAuthApi from "@/hooks/use-auth-api";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least 1 uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least 1 lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least 1 number");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push("At least 1 special character");
  return errors;
}

function validateName(name: string) {
  if (!name.trim()) return "This field is required";
  if (name.trim().length < 2) return "Must be at least 2 characters";
  return "";
}

function validateGender(gender: string) {
  if (!gender) return "Please select your gender";
  return "";
}

function validateDateOfBirth(dob: string) {
  if (!dob) return "Date of birth is required";
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 13) return "Must be at least 13 years old";
  if (age > 120) return "Please enter a valid date of birth";
  return "";
}

const RegisterPage = () => {
  const { setEmail, setPassword, reset } = useRegistration();
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [firstName, setFirstNameLocal] = useState("");
  const [lastName, setLastNameLocal] = useState("");
  const [gender, setGenderLocal] = useState("");
  const [dob, setDobLocal] = useState("");
  const [touched, setTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const { showToast, hideToast } = useTopToast();
  const { setUser, user } = useUser();

  const { execute } = useAuthApi(requestOTP);

  const router = useRouter();

  React.useEffect(() => {
    reset();
  }, [reset]);

  const isEmailValid = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const isPasswordValid = passwordErrors.length === 0;
  const isFirstNameValid = validateName(firstName) === "";
  const isLastNameValid = validateName(lastName) === "";
  const isGenderValid = validateGender(gender) === "";
  const isDobValid = validateDateOfBirth(dob) === "";
  const isValid =
    isEmailValid &&
    isPasswordValid &&
    isFirstNameValid &&
    isLastNameValid &&
    isGenderValid &&
    isDobValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      gender,
      dob,
    };

    // Reset all errors
    setEmailError("");
    setPasswordError([]);
    setFirstNameError("");
    setLastNameError("");
    setGenderError("");
    setDateOfBirthError("");

    // Validate all fields
    let hasErrors = false;

    if (!email) {
      setEmailError("Email is required.");
      hasErrors = true;
    } else if (!isEmailValid) {
      setEmailError("Please enter a valid email address.");
      hasErrors = true;
    }

    if (!isPasswordValid) {
      setPasswordError(passwordErrors);
      hasErrors = true;
    }

    const firstNameValidation = validateName(firstName);
    if (firstNameValidation) {
      setFirstNameError(firstNameValidation);
      hasErrors = true;
    }

    const lastNameValidation = validateName(lastName);
    if (lastNameValidation) {
      setLastNameError(lastNameValidation);
      hasErrors = true;
    }

    const genderValidation = validateGender(gender);
    if (genderValidation) {
      setGenderError(genderValidation);
      hasErrors = true;
    }

    const dobValidation = validateDateOfBirth(dob);
    if (dobValidation) {
      setDateOfBirthError(dobValidation);
      hasErrors = true;
    }

    if (hasErrors) return;

    showToast("Loading...", { type: "info" });

    try {
      const response = await registerUser(payload);
      // console.log("Registration successful");

      if (response) {
        showToast("Registration successful", {
          type: "success",
        });

        // console.log(response);
        setUser(response as any);

        const otpPayload = {
          email: email,
          request_type: "register",
        };
        await execute(otpPayload);
        showToast("OTP request sent successfully", {
          type: "success",
        });

        // console.log("OTP request sent successfully");
        router.push(`/auth/register/verify?email=${email}`);
      }
      // Reset form fields after successful registration
      setEmailLocal("");
      setPasswordLocal("");
      setFirstNameLocal("");
      setLastNameLocal("");
      setGenderLocal("");
      setDobLocal("");
      setTouched(false);
      setEmailError("");
      setPasswordError([]);
      setFirstNameError("");
      setLastNameError("");
      setGenderError("");
      setDateOfBirthError("");
      reset();
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Handle registration error (e.g., show error message)
      setEmailError("Registration failed. Please try again.");
      showToast(error.detail || "Registration failed. Please try again.", {
        type: "error",
      });
      return;
    } finally {
      hideToast();
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    if (!email) setEmailError("Email is required.");
    else if (!isEmailValid)
      setEmailError("Please enter a valid email address.");
    else setEmailError("");
  };

  const handlePasswordBlur = () => {
    setTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleFirstNameBlur = () => {
    setTouched(true);
    setFirstNameError(validateName(firstName));
  };

  const handleLastNameBlur = () => {
    setTouched(true);
    setLastNameError(validateName(lastName));
  };

  const handleGenderBlur = () => {
    setTouched(true);
    setGenderError(validateGender(gender));
  };

  const handleDobBlur = () => {
    setTouched(true);
    setDateOfBirthError(validateDateOfBirth(dob));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-lg rounded-lg space-y-6 flex flex-col items-center"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-dark-green">
        Create New account
      </h2>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmailLocal(e.target.value)}
            onBlur={handleEmailBlur}
            required
            aria-invalid={!!emailError}
            aria-describedby="email-error"
          />
          {touched && emailError && (
            <div id="email-error" className="text-red-600 text-sm mt-1">
              {emailError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <Input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPasswordLocal(e.target.value)}
            onBlur={handlePasswordBlur}
            required
            aria-invalid={passwordError.length > 0}
            aria-describedby="password-error"
          />
          {touched && passwordError.length > 0 && (
            <ul
              id="password-error"
              className="text-red-600 text-sm mt-1 list-disc list-inside"
            >
              {passwordError.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstNameLocal(e.target.value)}
            onBlur={handleFirstNameBlur}
            required
            aria-invalid={!!firstNameError}
            aria-describedby="first-name-error"
          />
          {touched && firstNameError && (
            <div id="first-name-error" className="text-red-600 text-sm mt-1">
              {firstNameError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastNameLocal(e.target.value)}
            onBlur={handleLastNameBlur}
            required
            aria-invalid={!!lastNameError}
            aria-describedby="last-name-error"
          />
          {touched && lastNameError && (
            <div id="last-name-error" className="text-red-600 text-sm mt-1">
              {lastNameError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <Select
            placeholder="Select your gender"
            value={gender}
            onChange={(value: string | string[]) =>
              setGenderLocal(typeof value === "string" ? value : value[0] || "")
            }
            onBlur={handleGenderBlur}
            required
            aria-invalid={!!genderError}
            aria-describedby="gender-error"
            options={[
              { value: "", label: "Select your gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
          {touched && genderError && (
            <div id="gender-error" className="text-red-600 text-sm mt-1">
              {genderError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <Input
            type="date"
            placeholder="Enter your date of birth"
            value={dob}
            onChange={(e) => setDobLocal(e.target.value)}
            onBlur={handleDobBlur}
            required
            aria-invalid={!!dateOfBirthError}
            aria-describedby="date-of-birth-error"
          />
          {touched && dateOfBirthError && (
            <div id="date-of-birth-error" className="text-red-600 text-sm mt-1">
              {dateOfBirthError}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={!isValid}
        >
          Create Account
        </Button>
      </form>
      <div className="flex justify-center text-sm text-gray-600 dark:text-dark-green mt-4">
        <Link href="/auth/login" className="hover:underline">
          Already have an account?
        </Link>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
