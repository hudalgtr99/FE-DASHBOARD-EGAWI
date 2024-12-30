import { ThemeContext } from "@/context/ThemeContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { TbBell, TbBuilding, TbLogout, TbMail, TbUser } from "react-icons/tb";
import {
  Avatar,
  Badge,
  Button,
  ButtonDarkMode,
  ButtonRipple,
  List,
  Popover,
  Tooltip,
} from "@/components";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/actions/auth";
import { authReducer } from "@/reducers/authReducers";
import { fetchUserDetails } from "@/constants/user";
import { Link } from "react-router-dom";

const Header = ({ setSideOpen }) => {
  const { themeSkin, navbarType, colorMode, themeColor } =
    useContext(ThemeContext);

  const { logoutUserResult } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk loading

  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading menjadi true sebelum mengambil data
    try {
      const userData = await fetchUserDetails();
      setUser(userData?.datapribadi);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // Set loading menjadi false setelah pengambilan data
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [dataNotif, setDataNotif] = useState([
    // Data notifikasi
  ]);

  const onLogout = (e) => {
    e.preventDefault();
    logoutUser(dispatch);
  };

  useEffect(() => {
    if (logoutUserResult) {
      dispatch(authReducer({ type: "LOGOUT_USER", payload: { data: false } }));
    }
  }, [logoutUserResult, dispatch]);

  return (
    <header
      className={`bg-base-50/30 dark:bg-neutral-900/10 backdrop-blur-sm h-20 px-6 pt-4 pb-0 top-0 w-full z-30 relative ${navbarType}`}
    >
      <div
        className={`w-full h-full flex justify-between items-center px-6 bg-white/80 dark:bg-base-600/80 backdrop-blur-sm rounded-md ${
          themeSkin === "default" ? "shadow-lg" : themeSkin
        }`}
      >
        <div>
          <div
            onClick={() => setSideOpen(true)}
            className="cursor-pointer block lg:hidden"
          >
            <HiOutlineMenu className="text-2xl" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {/* Dark Mode */}
            <Tooltip
              tooltip={colorMode === "light" ? "Dark Mode" : "Light Mode"}
              delay={500}
            >
              <ButtonDarkMode />
            </Tooltip>

            {/* Notification */}
            <Popover
              placement="bottom-end"
              spacing={20}
              rounded="md"
              button={
                <ButtonRipple className="p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-500">
                  <Badge
                    hidden
                    size="xl"
                    placement="top-end"
                    skidding={8}
                    color="success"
                  >
                    <div className="text-2xl">
                      <TbBell />
                    </div>
                  </Badge>
                </ButtonRipple>
              }
            >
              <div className="text-sm min-w-[360px]">
                <div>
                  <div className="py-2 px-4 border-b dark:border-base-500 flex items-center justify-between">
                    <div className="font-semibold">Notifications</div>
                    <ButtonRipple className="p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-500">
                      <Badge
                        size="xs"
                        placement="right-start"
                        skidding={-2}
                        spacing={-8}
                        color="success"
                      >
                        <TbMail className="text-lg" />
                      </Badge>
                    </ButtonRipple>
                  </div>
                  <div>
                    {dataNotif.length > 0 ? (
                      <div>
                        <div className="max-h-[236px] overflow-y-auto custom-scroll">
                          {dataNotif.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-4 py-3 hover:bg-base-50 dark:hover:bg-base-700 border-b dark:border-base-500 cursor-pointer flex items-start gap-2"
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium leading-none mb-1">
                                  {item.title}
                                </div>
                                <div className="text-xs text-base-100 dark:text-base-400">
                                  {item.description}
                                </div>
                                <div className="text-[10px] text-base-100 dark:text-base-400">
                                  {moment(
                                    item.date,
                                    "YYYY-MM-DDTHH:mm:ss"
                                  ).fromNow()}
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    backgroundColor: themeColor,
                                  }}
                                  className="w-2 h-2 rounded-full mt-1"
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 text-center border-t dark:border-base-500">
                          <Button variant="text" color="primary" block>
                            View All
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 py-10 w-full h-full flex items-center justify-center">
                        No Notification
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popover>
          </div>

          {/* Profile */}
          <Popover
            placement="bottom-end"
            spacing={20}
            rounded="md"
            button={
              <ButtonRipple className="rounded-full">
                <Badge size="sm" placement="right-end" color="success">
                  {user?.photo ? (
                    <Avatar color="primary" className="object-cover">
                      {loading ? (
                        ""
                      ) : (
                        <img
                          src={user?.photo}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Avatar>
                  ) : (
                    <Avatar color="primary">
                      {loading && user
                        ? ""
                        : user?.nama?.substring(0, 2).toUpperCase()}
                    </Avatar>
                  )}
                </Badge>
              </ButtonRipple>
            }
          >
            <div className="text-sm w-full md:min-w-[260px]">
              <div className="p-4 border-b dark:border-base-500">
                {loading ? (
                  <div className="text-center">Loading user details...</div> // Tampilkan loading
                ) : (
                  <Link to="/profile" className="flex gap-2 items-center">
                    <div className="w-fit">
                      {user?.photo ? (
                        <Avatar color="primary" className="object-cover">
                          {loading ? (
                            ""
                          ) : (
                            <img
                              src={user?.photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </Avatar>
                      ) : (
                        <Avatar color="primary">
                          {loading && user
                            ? ""
                            : user?.nama?.substring(0, 2).toUpperCase()}
                        </Avatar>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold whitespace-nowrap line-clamp-1">
                        {user?.nama}
                      </div>
                      <div className="text-xs line-clamp-1">{user?.email}</div>
                    </div>
                  </Link>
                )}
              </div>
              <div className="p-2 font-medium border-b dark:border-base-500">
                <Link to={"/profile"}>
                  <List prefix={<TbUser />} density="loose">
                    <div className="line-clamp-1">{user?.groups?.name}</div>
                  </List>
                </Link>
              </div>
              {user?.perusahaan && (
                <div className="p-2 font-medium border-b dark:border-base-500">
                  <List prefix={<TbBuilding />} density="loose">
                    <div className=" line-clamp-1">{user?.perusahaan.nama}</div>
                  </List>
                </div>
              )}
              <div className="p-2 font-medium">
                <List
                  onClick={onLogout}
                  color="danger"
                  prefix={<TbLogout />}
                  density="loose"
                >
                  Logout
                </List>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
