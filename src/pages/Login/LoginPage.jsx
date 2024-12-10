import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/actions/auth";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { Button, ButtonDarkMode, TextField, Tooltip } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { TbEye, TbEyeOff } from "react-icons/tb";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

const LoginPage = () => {
  const { loginUserResult, loginUserLoading } = useSelector(
    (state) => state.auth
  );
  const { colorMode, themeColor } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginUser(dispatch, { email, password });
    }
  };

  useEffect(() => {
    if (
      loginUserResult ||
      (isAuthenticated() &&
        isAuthenticated().level.filter(
          (item) => item === "Super Admin" || item === "Admin"
        ).length > 0)
    ) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginUserResult]);

  const [isShow, setIsShow] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const optionparticles = {
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: colorMode === "dark" ? "#fff" : themeColor,
      },
      links: {
        color: colorMode === "dark" ? "#fff" : themeColor,
        distance: 100,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 500,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
  };

  return (
    <div className="relative overflow-hidden">
      <div className="bg-base-100 dark:bg-base-800 absolute inset-0 z-0 transition-colors"></div>

      <div
        style={{
          backgroundColor: themeColor,
        }}
        className="w-24 h-24 absolute rounded-full blur-3xl top-40 left-1/2 -ml-72"
      ></div>
      <div
        style={{
          backgroundColor: themeColor,
        }}
        className="w-20 h-20 absolute rounded-full blur-3xl bottom-40 left-1/2"
      ></div>

      <Particles
        className="absolute inset-0 z-10"
        id="tsparticles"
        init={particlesInit}
        options={optionparticles}
      />

      <div
        style={{
          maskImage: `linear-gradient(to left top, transparent, black)`,
          WebkitMaskImage: `linear-gradient(to left top, transparent, black)`,
        }}
        className="absolute z-10 inset-0 h-full w-full bg-white/50 dark:bg-black/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      ></div>

      <div className="relative w-screen h-screen z-20 overflow-hidden flex bg-white/10 dark:bg-base-700/10 text-base-300  dark:text-base-200 font-light">
        <div className="flex w-full items-center justify-center p-10">
          <div className="w-full md:w-96 h-fit p-10 bg-white/10 dark:bg-base-700/10 backdrop-blur rounded-lg border border-base-100 dark:border-base-600 shadow-lg">
            <div className="font-semibold tracking-wide">Masuk!</div>
            <div className="tracking-wide text-sm font-normal">
              Mohon isi data dibawah ini.
            </div>

            <br />

            <form onSubmit={handleSubmit}>
              <div className="mb-2 flex flex-col gap-2">
                <TextField
                  label="Email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />

                <TextField
                  label="Password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  type={isShow ? "text" : "password"}
                  suffix={
                    isShow ? (
                      <TbEyeOff
                        className="cursor-pointer"
                        size={20}
                        onClick={() => setIsShow(false)}
                      />
                    ) : (
                      <TbEye
                        className="cursor-pointer"
                        size={20}
                        onClick={() => setIsShow(true)}
                      />
                    )
                  }
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <br />
              <Button
                type="submit"
                variant="flat"
                block
                color="primary"
                loading={loginUserLoading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>

        <div className="absolute right-10 bottom-10 rounded-full dark:border-base-500">
          <Tooltip
            tooltip={colorMode === "light" ? "Dark Mode" : "Light Mode"}
            placement="left"
            delay={500}
          >
            <ButtonDarkMode />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
