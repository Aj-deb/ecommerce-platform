import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../Context/AuthContext";
import { VerifyEmail } from "../api/Auth.api";
import Fields from "../components/input";
import Button from "../components/button";
import useSendOtp from "../hooks/sendotp";

const Register = ({ next, formdata, setFormdata }) => {
  const { Validation } = useAuth();
  const sendOtpRequest = useSendOtp(next);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    if (formdata.password !== formdata.confirmpassword) {
    setErrors({
      Matched: "Passwords do not match",
    });
    setLoading(false);
    return;
    }
    try {
      await VerifyEmail(formdata);
      sendOtpRequest.mutate(formdata.email);
      next();
    } catch (err) {
      if (err.response?.status === 403) {
        setErrors({
          exist: "Email already created",
        });
      } else {
        const newErrors = Validation(err);
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-3xl font-semibold mt-16 mb-0 m-14">Create Account</h3>

      <form onSubmit={handleSubmit}>
        <div className="text-md font-medium text-gray-600 mt-8 m-14">
          <p>Name</p>
          <Fields
            type="text"
            name="name"
            placeholder="Enter the Name"
            onChange={(e) =>
              setFormdata({ ...formdata, name: e.target.value })
            }
          />
          <p className="text-red-500 text-sm">{errors.name}</p>

          <p className="mt-4">Email</p>
          <Fields
            type="email"
            name="email"
            placeholder="Enter the email"
            onChange={(e) =>
              setFormdata({ ...formdata, email: e.target.value })
            }
          />
          <p className="text-red-500 text-sm">{errors.email || errors.exist}</p>

          <p className="mt-4">Password</p>
          <Fields
            type="password"
            name="password"
            placeholder="Enter the password"
            onChange={(e) =>
              setFormdata({ ...formdata, password: e.target.value })
            }
          />
          <p className="text-red-500 text-sm">{errors.password}</p>

          <p className="mt-4">Confirm Password</p>
          <Fields
            type="password"
            name="confirmpassword"
            placeholder="Confirm the password"
            onChange={(e) =>
              setFormdata({
                ...formdata,
                confirmpassword: e.target.value,
              })
            }
          />
          <p className="text-red-500 text-sm">{errors.Matched}</p>

          <p className="text-red-500 text-sm">{errors.general}</p>

          <Button
            className="w-full"
            name="Continue"
            disabled={loading}
            type="submit"
          >
            {loading ? "Continue..." : "Continue"}
          </Button>

          <p className="text-sm font-semibold mt-4 flex justify-center">
            Already a user ?
            <Link to="/" className="text-blue-500 px-1">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;