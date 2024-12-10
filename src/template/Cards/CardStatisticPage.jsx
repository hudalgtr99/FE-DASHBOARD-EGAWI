import {
  Button,
  ButtonRipple,
  Card,
  CardStatistic,
  Popover,
} from "@/components";
import { convertToRupiah } from "./../../utils/convertToRupiah";
import {
  TbAdCircle,
  TbAddressBook,
  TbCrown,
  TbDots,
  TbMenu,
  TbMoneybag,
  TbSettings,
} from "react-icons/tb";
import { CardBalance, CardDonuts } from "@/components";

const CardStatisticPage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Card #1 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStatistic
          value={99}
          title="Harga Bulan Ini"
          description="Bulan ini Naik 20%"
          icon={<TbAddressBook />}
        />
        <CardStatistic
          value={200}
          color="danger"
          title="Harga Bulan Ini"
          description="Bulan ini Naik 20%"
          icon={<TbAdCircle />}
        />
        <CardStatistic
          value={99}
          color="success"
          title="Harga Bulan Ini"
          description="Bulan ini Naik 20%"
          icon={<TbSettings />}
        />
        <CardStatistic
          value={99}
          color="#fd76df"
          title="Harga Bulan Ini"
          description="Bulan ini Naik 20%"
          icon={<TbCrown />}
        />
      </div>

      {/* Card #2 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Pengguna</div>
              <div className="text-2xl">99</div>
            </div>

            <div className="text-xl p-3">
              <TbMoneybag />
            </div>
          </div>
        </Card>
        <Card color="danger" variant="border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Pengguna</div>
              <div className="text-2xl">99</div>
            </div>

            <div className="text-xl p-3">
              <TbMoneybag />
            </div>
          </div>
        </Card>
        <Card color="success" variant="border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Pengguna</div>
              <div className="text-2xl">99</div>
            </div>

            <div className="text-xl p-3">
              <TbMoneybag />
            </div>
          </div>
        </Card>
        <Card color="#fd76df" variant="border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Pengguna</div>
              <div className="text-2xl">99</div>
            </div>

            <div className="text-xl p-3">
              <TbMoneybag />
            </div>
          </div>
        </Card>
      </div>

      {/* Card #3 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardBalance
          colorFrom="danger"
          colorTo="info"
          title="Current Balance"
          value={100000}
        />
        <CardBalance
          colorFrom="danger"
          colorTo="info"
          title="Current Balance"
          value={100000}
        />
        <CardBalance
          colorFrom="primary"
          colorTo="success"
          title="Current Balance"
          value={12500000}
        />
        <CardBalance
          colorFrom="warning"
          colorTo="danger"
          title="Current Balance"
          value={45028000}
        />
      </div>

      {/* Card #4 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <Card variant="border">
					<div className="flex items-center justify-between">
						<div>Hello</div>
						<div>
							<Popover
								button={
									<Button size="10" className="p-2">
										<TbDots className="rounded" />
									</Button>
								}
							>
								Hello
							</Popover>
						</div>
					</div>
				</Card> */}
      </div>
    </div>
  );
};

export default CardStatisticPage;
